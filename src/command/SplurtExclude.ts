import { ArticleDatabase } from '../database/ArticleDatabase'
import { SplurtCommand } from './SplurtCommand'

import Color from 'colors'

export class SplurtExclude implements SplurtCommand<void> {
  constructor(public criteria?: string[], public sqlite?: string) { }

  public async execute() {
    this.verifyOptions()

    if (this.sqlite !== undefined) {
      const database = await ArticleDatabase.connect(this.sqlite)

      if (this.criteria !== undefined) {
        this.criteria.forEach(async where => {
          const n = await database.exclude(where)
          console.log(`where: ${Color.green(`${n === undefined ? 0 : n} articles excluded!`)}`)
        })
      } else console.log(Color.red('No criteria selected!'))
    }
  }

  public verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }
}
