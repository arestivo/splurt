import { DBLPScraper } from "../scraper/DBLPScraper"
import { Article } from "../data/Article";
import Color from 'colors'

const dblp = new DBLPScraper()

class Splurt {
  query: string = ''
  maximum: number = 10
  databases: string[] = []

  execute() {
    this.verifyOptions()

    this.databases.forEach(database => {
      switch (database) {
        case 'dblp': 
          dblp.query(this.query, this.maximum)
          .then(function(articles : Article[]) {
            console.log(articles)
          });
          break;
        default:
          console.warn(Color.yellow('WARNING: Unknown research database: ' + database))
      }
    })
  }

  verifyOptions() {
    if (this.databases.length == 0)
      throw new Error('No research database chosen!')

    if (!this.query)
      throw new Error('No query given!')
  }
}

export {Splurt}