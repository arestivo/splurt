import { DBLPScraper } from "../scraper/DBLPScraper"
import { Article } from "../data/Article";

class Splurt {
  dblp: boolean = false
  scopus : boolean = false
  compendex: boolean = false

  maximum: number = 10

  query: string = ''

  execute() {
    if (this.dblp) {
      const dblp = new DBLPScraper()
      dblp.query(this.query, this.maximum)
      .then(function(articles : Article[]) {
        console.log(articles)
      })
    }
  }
}

export {Splurt}