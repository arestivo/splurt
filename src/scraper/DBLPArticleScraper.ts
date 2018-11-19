import {Article} from '../data/Article'
import {ArticleScraper} from './ArticleScraper'

import progress, { Bar } from 'cli-progress'

var parser = require('logic-query-parser');

class DBLPArticleScraper extends ArticleScraper {
  public uri = 'http://dblp.org/search/publ/api'
  public bar = new Bar({}, progress.Presets.shades_classic)

  public async query(q: string, maximum: number = 10): Promise<Article[]> {
    let current: number = 0
    let articles: Article[] = []

    let tree = parser.parse(q)
    q = this.getTreeLexemes(tree).join(' | ')

    this.bar.start(0, 0)

    while (!maximum || current < maximum) {
      let newArticles = await this.queryPage(q, current, maximum)
      if (newArticles.length === 0) break

      let validArticles = newArticles.filter(article => this.isValidTitle(article.title, tree))

      articles = articles.concat(validArticles)
      current += newArticles.length

      this.bar.setTotal(this.bar.getTotal() - (newArticles.length - validArticles.length))
      this.bar.update(Math.min(articles.length, maximum))
    }

    this.bar.stop()

    return articles.slice(0, maximum)
  }

  private isValidTitle(title : string, tree : any) : boolean {
    if (tree.lexeme.value)
      return title.toLowerCase().includes(tree.lexeme.value.toLowerCase().replace(/\'/g, ''))

    if (tree.lexeme.type == 'and')
      return this.isValidTitle(title, tree.left) && this.isValidTitle(title, tree.right)

    if (tree.lexeme.type == 'or')
      return this.isValidTitle(title, tree.left) || this.isValidTitle(title, tree.right)

    return true
  }

  private async queryPage(q: string, f: number, maximum: number): Promise<Article[]> {
    const json = await this.get(this.uri, {q, f, format : 'json'})
    const elements: any[] = json.data.result.hits.hit

    if (this.bar.getTotal() == 0)
      this.bar.setTotal(Math.min(json.data.result.hits['@total'], maximum))

    return elements ? elements.map(e => e.info).map(
      (i: any) => ({
        origin: 'dblp',
        title: i.title,
        year: i.year,
        doi: i.doi,
        authors: i.authors ? (
            Array.isArray(i.authors.author) ?
            i.authors.author.join(', ') :
            i.authors.author ) : undefined // Undefined author
      })
    ) : [] // No articles
  }

  private getTreeLexemes(tree : any) : string[] {
    let lexemes : Array<string> = []

    if (tree.lexeme.value)
      lexemes = lexemes.concat(tree.lexeme.value.split('-'))
    if (tree.left)
      lexemes = lexemes.concat(this.getTreeLexemes(tree.left))
    if (tree.right)
      lexemes = lexemes.concat(this.getTreeLexemes(tree.right))

    lexemes = lexemes.map(lexeme => lexeme.replace(/\W/g, ''))

    return lexemes
  }
}

export { DBLPArticleScraper }
