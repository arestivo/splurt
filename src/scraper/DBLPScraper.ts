import {Article} from '../data/Article'
import {Scraper} from './Scraper'

class DBLPScraper extends Scraper {
  async query(q : string): Promise<any> {
    this.get('http://dblp.org/search/publ/api', {q : q, format : 'json'})
      .then(function (response) {
        let hits = response.data.result.hits.hit
        hits.forEach((hit : any) => {
          console.log(hit.info.title)
        });
      })
  return [new Article()]
  }

}

export {DBLPScraper}
