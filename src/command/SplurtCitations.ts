import { SplurtCommand } from './SplurtCommand'
import { Article } from '../data/Article'
import { GoogleCiteScraper } from '../scraper/GoogleCiteScraper'
import Color from 'colors'
import { ArticleDatabase } from '../database/ArticleDatabase'
import progress, { Bar } from 'cli-progress'

class SplurtCitations implements SplurtCommand {
  public delay: number = 2
  public cookie?: string
  public sqlite?: string

  public async execute() {
    this.verifyOptions()

    const google = new GoogleCiteScraper(this.delay, this.cookie)

    if (this.sqlite !== undefined) {
      const database = new ArticleDatabase(this.sqlite)
      database.init(() => {
        database.fetchNeedsCite(async (articles: Article[]) => {
          if (articles.length === 0) {
            console.log(Color.green('All articles have citations!'))
            return []
          }

          const bar = new Bar({}, progress.Presets.shades_classic)
          bar.start(articles.length, 0)

          for (let i = 0; i < articles.length; i++)
            try {
              const cites = await google.getCiteCount(articles[i])
              database.updateCites(articles[i].title, cites)
              bar.update(i + 1)
            } catch(e) {
              bar.stop()
              console.log(Color.yellow('Gimme cookie!'))
              process.exit(0)
            }
          bar.stop()
        })
      })
    }
  }

  public verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }
}

export { SplurtCitations }
