import { DBLPScraper } from "../scraper/DBLPScraper"
import { Article } from "../data/Article";
import Color from 'colors'

class Splurt {
  dblp: boolean = false
  scopus : boolean = false
  compendex: boolean = false
  inspec: boolean = false

  maximum: number = 10

  query: string = ''

  execute() {
    this.verifyOptions()

    if (this.dblp) {
      const dblp = new DBLPScraper()
      dblp.query(this.query, this.maximum)
      .then(function(articles : Article[]) {
        console.log(articles)
      })
    }
  }

  verifyOptions() {
    if (!this.dblp && !this.compendex && !this.scopus)
      throw new Error('No research database chosen!')

    if (!this.query)
      throw new Error('No query given!')
  }

  addDatabase(database: string) {
    switch(database) {
      case 'dblp': this.dblp = true; break;
      case 'scopus': this.dblp = true; break;
      case 'compendex': this.compendex = true; break;
      case 'inspec': this.inspec = true; break;
      default: console.log(Color.yellow('Unknown database: ' + database))
    }
  }
}

export {Splurt}