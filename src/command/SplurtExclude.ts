import { ArticleDatabase } from '../database/ArticleDatabase'
import { SplurtCommand } from './SplurtCommand'

import Color from 'colors'

export class SplurtExclude implements SplurtCommand<void> {
  public criteria?: string[]
  public sqlite?: string

  public async execute() {
    this.verifyOptions()

    if (this.sqlite !== undefined) {
      const database = new ArticleDatabase(this.sqlite)
      database.init(() => {
        if (this.criteria !== undefined) {
          this.criteria.forEach(where => {
            database.exclude(where, n => {
              console.log(`where: ${Color.green(`${n === undefined ? 0 : n} articles excluded!`)}`)
            })
          })
        } else console.log(Color.red('No criteria selected!'))
      })
    }
  }

  public verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }
}
