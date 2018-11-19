import { Article } from '../data/Article'
import { ArticleDatabase } from '../database/ArticleDatabase'
import { GoogleCiteScraper } from '../scraper/GoogleCiteScraper'
import { SplurtCommand } from './SplurtCommand'

import progress, { Bar } from 'cli-progress'
import Color from 'colors'

export class SplurtCitations implements SplurtCommand<void> {
  constructor(public delay = 2, public cookie?: string, public sqlite?: string) { }

  public async execute() {
    this.verifyOptions()

    const google = new GoogleCiteScraper(this.delay, this.cookie)

    if (this.sqlite !== undefined) {
      const database = await ArticleDatabase.connect(this.sqlite)
      const articles = await database.fetchNeedsCite()

      if (articles.length === 0) {
        console.log(Color.green('All articles have citations!'))
      }

      const bar = new Bar({}, progress.Presets.shades_classic)
      bar.start(articles.length, 0)

      for (let i = 0; i < articles.length; i += 1)
        try {
          const cites = await google.getCiteCount(articles[i])
          await database.updateCites(articles[i].title, cites)
          bar.update(i + 1)
        } catch (e) {
          bar.stop()
          console.log(Color.yellow('Gimme cookie!'))
          process.exit(0)
        }
      bar.stop()
    }
  }

  public verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }
}
