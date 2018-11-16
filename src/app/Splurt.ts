import { DBLPScraper } from "../scraper/DBLPScraper"
import { Article } from "../data/Article";
import Color from 'colors'

class Splurt {
  query: string = ''
  maximum: number = 10
  databases: string[] = []

  execute() {
    this.verifyOptions()

    if (this.databases.includes('dblp')) {
      const dblp = new DBLPScraper()
      dblp.query(this.query, this.maximum)
      .then(function(articles : Article[]) {
        console.log(articles)
      })
    }
  }

  verifyOptions() {
    if (this.databases.length == 0)
      throw new Error('No research database chosen!')

    if (!this.query)
      throw new Error('No query given!')
  }
}

export {Splurt}