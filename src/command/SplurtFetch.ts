import { DBLPArticleScraper } from "../scraper/DBLPArticleScraper"
import { Article } from "../data/Article";
import Color from 'colors'

const dblp = new DBLPArticleScraper()

class SplurtFetch {
  query: string = ''
  maximum: number = 10
  databases: string[] = []

  async execute() {
    this.verifyOptions()

    const promises : Promise<Article[]>[] = this.databases.map(database => {
      switch (database) {
        case 'dblp': 
          return dblp.query(this.query, this.maximum)
        default:        
          console.warn(Color.yellow('WARNING: Unknown research database: ' + database))
          return Promise.resolve([])
      }
    })

    const articles : Article[] = (await Promise.all(promises))
      .reduce((acc, val) => acc.concat(val), [])

    return articles
  }

  verifyOptions() {
    if (!this.databases || this.databases.length == 0)
      throw new Error('No research database chosen!')

    if (!this.query)
      throw new Error('No query given!')
  }
}

export { SplurtFetch }