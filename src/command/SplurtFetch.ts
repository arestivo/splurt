import { Article } from '../data/Article'
import { DBLPArticleScraper } from '../scraper/DBLPArticleScraper'

import Color from 'colors'

const dblp = new DBLPArticleScraper()

export class SplurtFetch {
  public query: string = ''
  public maximum: number = 10
  public databases: string[] = []

  public async execute() {
    this.verifyOptions()

    const promises: Array<Promise<Article[]>> = this.databases.map(database => {
      switch (database) {
        case 'dblp':
          return dblp.query(this.query, this.maximum)
        default:
          console.warn(Color.yellow('WARNING: Unknown research database: ' + database))
          return Promise.resolve([])
      }
    })

    const articles: Article[] = (await Promise.all(promises))
      .reduce((acc, val) => acc.concat(val), [])

    return articles
  }

  public verifyOptions() {
    if (!this.databases || this.databases.length === 0)
      throw new Error('No research database chosen!')

    if (!this.query)
      throw new Error('No query given!')
  }
}
