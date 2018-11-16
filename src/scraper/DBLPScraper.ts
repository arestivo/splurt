import {Article} from '../data/Article'
import {Scraper} from './Scraper'
import { addListener } from 'cluster';

class DBLPScraper extends Scraper {
  uri : string = 'http://dblp.org/search/publ/api'

  async query(q : string, maximum : number = 10): Promise<any[]> {
    let current : number = 0
    let articles : any[] = []

    while (!maximum || current < maximum) {
      const newArticles : any[] = await this.queryPage(q, current)
      if (newArticles.length == 0) break
      articles = articles.concat(newArticles)
      current += newArticles.length
    }

    return articles.slice(0, maximum)
  }

  async queryPage(q : string, f : number) : Promise<any[]> {
    const articles = await this.get(this.uri, {q, f, format : 'json'})
    return articles.data.result.hits.hit ? articles.data.result.hits.hit.map(
      (hit : any) => ({
        title: hit.info.title, 
        year: hit.info.year,
        doi: hit.info.doi,
        authors: hit.info.authors ? (
            Array.isArray(hit.info.authors.author) ? 
            hit.info.authors.author.join(', ') : 
            hit.info.authors.author ) : undefined
      })
    ) : []
  }
}

export {DBLPScraper}