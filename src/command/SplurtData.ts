import { Article } from '../data/Article'
import { ArticleDatabase } from '../database/ArticleDatabase'
import { ScholarDataScraper } from '../scraper/data/ScholarDataScraper'
import { SplurtCommand } from './SplurtCommand'

import progress, { Bar } from 'cli-progress'
import Color from 'colors'

export class SplurtData implements SplurtCommand<void> {
  constructor(public delay = 2, public cookie?: string, public sqlite?: string) { }

  public async execute() {
    this.verifyOptions()

    const google = new ScholarDataScraper(this.delay, this.cookie)

    if (this.sqlite !== undefined) {
      const database = await ArticleDatabase.connect(this.sqlite)
      const articles = await database.fetchNeedsData()

      if (articles.length === 0) {
        console.log(Color.green('All articles have data!'))
      }

      const bar = new Bar({
        format: 'scholar [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}'
      }, progress.Presets.shades_classic)
      bar.start(articles.length, 0)

      for (let i = 0; i < articles.length; i += 1)
        try {
          const article = await google.getData(articles[i])
          await database.updateData(article)
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
