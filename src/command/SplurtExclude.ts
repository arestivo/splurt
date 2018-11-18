import { SplurtCommand } from "./SplurtCommand";
import { ArticleDatabase } from "../database/ArticleDatabase";

import Color from 'colors'

class SplurtExclude extends SplurtCommand {
  criteria: string[] | undefined = undefined
  sqlite: string | undefined = undefined

  async execute() {
    this.verifyOptions()

    if (this.sqlite != undefined) {
      const database = new ArticleDatabase(this.sqlite)

      if (this.criteria != undefined) {
        this.criteria.forEach((where : string) => {
          database.exclude(where, function(number : number) {
            console.log(where + ': ' + Color.green(`${number == undefined ? 0 : number} articles excluded!`))
          });
        })
      } else console.log(Color.red('No criteria selected!'))        
    }
  }

  verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }
}

export { SplurtExclude }