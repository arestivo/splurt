import { Article } from '../data/Article'
import { ArticleScraper } from './ArticleScraper'

import progress, { Bar } from 'cli-progress'
import Color from 'colors'

const parser = require('logic-query-parser')

export class ScopusArticleScraper extends ArticleScraper {
  public uri = 'https://api.elsevier.com/content/search/scopus'

  public constructor(public key? : string, public validate? : boolean) {
    super()
  }

  public async query(query: string, maximum: number = 10): Promise<Article[]> {
    if (!this.key) {
      console.log(Color.yellow('API key needed for scopus search!'))
      return []
    }

    let current = 0
    let articles: Article[] = []

    const bar = new Bar({
      format: 'scopus [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}'
    }, progress.Presets.shades_classic)

    bar.start(maximum || 1, 0, { })

    while (!maximum || articles.length < maximum) {
      const newArticles = await this.queryPage(query, current, maximum, bar)
      if (newArticles.length === 0) break

      articles = articles.concat(newArticles)
      current += newArticles.length

      bar.update(Math.min(current, maximum ? maximum : current), { })
    }

    bar.stop()

    articles = maximum ? articles.slice(0, maximum) : articles

    if (this.validate) {
      const tree = parser.parse(query.replace(/\'/g, '"'))
      articles = articles.filter(article => ScopusArticleScraper.isValidTitle(article.title, tree))
    }

    return articles
  }

  private async queryPage(query: string, start: number, maximum: number, bar : Bar): Promise<Article[]> {
    const json = await ScopusArticleScraper.get(this.uri, { query, start, apiKey : this.key, count : maximum ? Math.min(maximum, 200) : 200, subj: 'COMP' })

    const elements: any[] = json.data['search-results'].entry
    const total = json.data['search-results']['opensearch:totalResults']

    bar.setTotal(Math.min(total , maximum ? maximum : total))

    return elements ? elements.map(
      (e: any) => ({
        origin: 'scopus',
        title: e['dc:title'],
        year: e['prism:coverDate'].match(/\d{4}/)[0],
        doi: e['prism:doi'],
        publication: e['prism:publicationName'],
        authors: e['dc:creator'],
        type: ScopusArticleScraper.normalizeType(e['prism:aggregationType'])
      })
    ) : [] // No articles
  }

  protected static normalizeType(type : string) {
    switch (type) {
      case 'Journal': return 'journal'
      default: return type
    }
  }
}
