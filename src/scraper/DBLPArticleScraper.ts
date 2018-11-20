import { Article } from '../data/Article'
import { ArticleScraper } from './ArticleScraper'

import progress, { Bar } from 'cli-progress'

const parser = require('logic-query-parser')
const entities = require('html-entities').AllHtmlEntities

export class DBLPArticleScraper extends ArticleScraper {
  public uri = 'http://dblp.org/search/publ/api'

  public async query(q: string, maximum: number = 10): Promise<Article[]> {
    let articles: Article[] = []

    const tree = parser.parse(q.replace(/\'/g, '"'))

    const lexemes = DBLPArticleScraper.getTreeLexemes(tree).filter((lexeme, index, self) =>
      index === self.findIndex((other : string) => (
        lexeme === other
      ))
    )

    console.log(`DBLP Lexemes: ${lexemes.join(' | ')}`)

    for (const lexeme of lexemes) {
      const newArticles = await this.queryPartial(lexeme, maximum, tree, articles.length)

      articles = articles.concat(newArticles)

      // Remove duplicates
      articles = articles.filter((article, index, self) =>
        index === self.findIndex(a => (
          article.title === a.title && article.year === a.year
        ))
      )

      if (maximum && articles.length > maximum) break
    }

    return maximum ? articles.slice(0, maximum) : articles
  }

  private async queryPartial(query: string, maximum: number = 10, tree : any, previous: number): Promise<Article[]> {
    let current = 0
    let articles: Article[] = []

    const bar = new Bar({
      format: `dblp ${query} [{bar}] {percentage}% | A: {fetched} | ETA: {eta}s | {value}/{total}`
    }, progress.Presets.shades_classic)

    bar.start(maximum || 1, 0, { fetched : previous })

    while (!maximum || articles.length < maximum) {
      const newArticles = await this.queryPage(query, current, maximum, bar)
      if (newArticles.length === 0) break

      const validArticles = newArticles.filter(article => DBLPArticleScraper.isValidTitle(article.title, tree))

      articles = articles.concat(validArticles)
      current += newArticles.length

      bar.update(Math.min(current, maximum ? maximum : current), { fetched: articles.length + previous })
    }

    bar.stop()

    return maximum ? articles.slice(0, maximum) : articles
  }

  private async queryPage(q: string, f: number, maximum: number, bar : Bar): Promise<Article[]> {
    const json = await DBLPArticleScraper.get(this.uri, { q, f, format : 'json' })
    const elements: any[] = json.data.result.hits.hit
    const total = json.data.result.hits['@total']

    bar.setTotal(Math.min(total , maximum ? maximum : total))

    return elements ? elements.map(e => e.info).map(
      (i: any) => ({
        origin: 'dblp',
        title: entities.decode(i.title),
        year: i.year,
        doi: i.doi,
        publication: entities.decode(i.venue ? i.venue.toString() : undefined),
        authors: i.authors ? (
            Array.isArray(i.authors.author) ?
            i.authors.author.join(', ') :
            i.authors.author) : undefined // Undefined author
      })
    ) : [] // No articles
  }

  private static getTreeLexemes(tree : any) : string[] {
    if (tree.lexeme.value)
      return [tree.lexeme.value.replace(/\s+/g, ' ').replace('-', ' ').toLowerCase()]

    let lexemes : string[] = []
    if (tree.lexeme.type === 'or') {
      lexemes = lexemes.concat(this.getTreeLexemes(tree.left))
      lexemes = lexemes.concat(this.getTreeLexemes(tree.right))
      lexemes = lexemes.map(lexeme => lexeme.replace(/[^a-zA-Z\s-]/g, ''))
      return lexemes
    }

    if (tree.lexeme.type === 'and') {
      const left = this.getTreeLexemes(tree.left)
      const right = this.getTreeLexemes(tree.right)

      if (left.length === 1 && right.length === 1)
        return [`${left[0]}, ${right[0]}`]
      return left.concat(right)
    }

    return []
  }

  private static isValidTitle(title : string, tree : any) : boolean {
    if (!title) return false

    if (tree.lexeme.value)
      return title.toLowerCase().includes(tree.lexeme.value.toLowerCase().replace(/\'/g, ''))

    if (tree.lexeme.type === 'and')
      return this.isValidTitle(title, tree.left) && this.isValidTitle(title, tree.right)

    if (tree.lexeme.type === 'or')
      return this.isValidTitle(title, tree.left) || this.isValidTitle(title, tree.right)

    return true
  }
}
