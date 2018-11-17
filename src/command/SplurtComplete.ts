import { SplurtCommand } from "./SplurtCommand";
import { Article } from "../data/Article";
import { GoogleCiteScraper } from "../scraper/GoogleCiteScraper";
import Color from 'colors'
import { ArticleDatabase } from "../database/ArticleDatabase";

class SplurtComplete extends SplurtCommand {
  delay: number = 2
  cookie: string | undefined = undefined
  sqlite: string | undefined = undefined

  async execute() {
    this.verifyOptions()

    const google = new GoogleCiteScraper(this.delay, this.cookie)

    if (this.sqlite != undefined) {
      const database = new ArticleDatabase(this.sqlite)
      database.fetchNeedsCite(async function(articles : Article[]) {
        console.log(Color.green(`Citations needed for ${articles.length} articles!`))
        for (let i = 0; i < articles.length; i++)
        try {
          let cites = await google.getCiteCount(articles[i]);
          console.log(articles[i].title + ': ' + cites)
          database.updateCites(articles[i].title, cites)
        } catch(e) {
          console.log(Color.yellow('Gimme cookie!'))
          process.exit(0)
        }
      })
    }
  }

  verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }
}

export { SplurtComplete }

