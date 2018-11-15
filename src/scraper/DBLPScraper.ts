import {Article} from '../data/Article'
import {Scraper} from './Scraper'

class DBLPScraper extends Scraper {
  async query(q : string): Promise<any> {
    this.get('http://dblp.org/search/publ/api', {q : q, format : 'json'})
      .then(function (response) {
        let hits = response.data.result.hits.hit
        let articles = hits.map(function(hit : any) {
          return {title: hit.info.title}
        })
      })
  }
}

export {DBLPScraper}
