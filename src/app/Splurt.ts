import { DBLPScraper } from "../scraper/DBLPScraper"

class Splurt {
  dblp: boolean = false
  scopus : boolean = false
  compendex: boolean = false

  query: string = ''

  execute() {
    if (this.dblp) {
      const dblp = new DBLPScraper()
      dblp.query(this.query)
      .then(function(articles : any[]) {
        console.log(articles)
      })
    }
  }
}

export {Splurt}