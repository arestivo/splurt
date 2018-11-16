import {Article} from '../data/Article'
import {ArticleScraper} from './ArticleScraper'

class DBLPArticleScraper extends ArticleScraper {
  uri : string = 'http://dblp.org/search/publ/api'

  async query(q : string, maximum : number = 10): Promise<Article[]> {
    let current : number = 0
    let articles : Article[] = []

    while (!maximum || current < maximum) {
      const newArticles : Article[] = await this.queryPage(q, current)
      if (newArticles.length == 0) break
      articles = articles.concat(newArticles)
      current += newArticles.length
    }

    return articles.slice(0, maximum)
  }

  async queryPage(q : string, f : number) : Promise<Article[]> {
    const json = await this.get(this.uri, {q, f, format : 'json'})
    const elements = json.data.result.hits.hit
    return elements ? elements.map(
      (hit : any) => ({
        origin: 'dblp',
        title: hit.info.title, 
        year: hit.info.year,
        doi: hit.info.doi,
        authors: hit.info.authors ? (
            Array.isArray(hit.info.authors.author) ? 
            hit.info.authors.author.join(', ') : 
            hit.info.authors.author ) : undefined // Undefined author
      })
    ) : [] // No articles
  }
}

export {DBLPArticleScraper}