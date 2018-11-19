import { ArticleDatabase } from '../database/ArticleDatabase'
import { SplurtCommand } from './SplurtCommand'
import Color from 'colors'
import { table } from 'table'

const jsonexport = require('jsonexport')

export class SplurtExport implements SplurtCommand<void> {
  constructor(public format?: string, public sqlite?: string, public data?: string[]) { }

  public async execute() {
    this.verifyOptions()

    if (this.sqlite !== undefined) {
      const database = await ArticleDatabase.connect(this.sqlite)
      const articles = await database.getSelectedArticles(this.data)

      switch (this.format) {
        case 'csv':
          jsonexport(articles, { rowDelimiter: '|' }, (err : any, csv : any) => {
            if (err) return console.log(err)
            console.log(csv)
          })
          break
        case 'table':
          const data = articles.map((article:any) => {
            const columns: any[] = []
            for (const key in article)
              columns.push(article[key])
            return columns
          })
          console.log(table(data))
          break
        default:
          console.log(Color.red(`Unknown format: ${this.format}`))
      }
    }
  }

  public verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }
}
