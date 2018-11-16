import {Article} from '../data/Article'
import {Scraper} from './Scraper'

class DBLPScraper extends Scraper {
  uri : string = 'http://dblp.org/search/publ/api'

  async query(q : string): Promise<any> {
    const articles = await this.get(this.uri, {q, format : 'json'})
    return articles.data.result.hits.hit.map(
      (hit : any) => ({
        title: hit.info.title, 
        year: hit.info.year,
        doi: hit.info.doi,
        authors: Array.isArray(hit.info.authors.author) ? 
          hit.info.authors.author.join(', ') : 
          hit.info.authors.author
      })
    )
  }
}

export {DBLPScraper}