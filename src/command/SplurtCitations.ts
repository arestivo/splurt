import { SplurtCommand } from "./SplurtCommand";
import { Article } from "../data/Article";
import { GoogleCiteScraper } from "../scraper/GoogleCiteScraper";
import Color from 'colors'
import { ArticleDatabase } from "../database/ArticleDatabase";
import progress, { Bar } from 'cli-progress';

class SplurtCitations extends SplurtCommand {
  delay: number = 2
  cookie: string | undefined = undefined
  sqlite: string | undefined = undefined

  async execute() {
    this.verifyOptions()

    const google = new GoogleCiteScraper(this.delay, this.cookie)

    if (this.sqlite != undefined) {
      const database = new ArticleDatabase(this.sqlite)
      database.init(() => {
        database.fetchNeedsCite(async function(articles : Article[]) {
          const bar : Bar = new Bar({}, progress.Presets.shades_classic);

          bar.start(articles.length, 0)

          if (articles.length == 0)
            console.log(Color.green('All articles have citations!'))

          for (let i = 0; i < articles.length; i++)
            try {
              let cites = await google.getCiteCount(articles[i]);
              database.updateCites(articles[i].title, cites)
              bar.update(i)
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

  verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }
}

export { SplurtCitations }

