import {Article} from '../data/Article'
import {Scraper} from './Scraper'

class DBLPScraper extends Scraper {
  uri : string = 'http://dblp.org/search/publ/api'

  async query(q : string): Promise<any> {
    return this.get(this.uri, {q : q, format : 'json'})
    .then(function (response) {
      return response.data.result.hits.hit.map(
        (hit : any) => ({title: hit.info.title, year: hit.info.year})
      )
    })
  }
}

export {DBLPScraper}
