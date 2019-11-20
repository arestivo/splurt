import { ArticleDatabase } from '../database/ArticleDatabase'
import { SplurtCommand } from './SplurtCommand'
import { Article } from '../data/Article'
import Color from 'colors'
import { table } from 'table'

import fs from 'fs'
import mustache from 'mustache'
import axios from 'axios'
import cheerio from 'cheerio'
import delay from 'delay'
import { template } from '../templates/articles'

const jsonexport = require('jsonexport')

export class SplurtExport implements SplurtCommand<void> {
  constructor(public format?: string, public sqlite?: string, public data?: string[], public scihub?: string) { }

  public async execute() {
    this.verifyOptions()

    if (this.sqlite !== undefined) {
      const database = await ArticleDatabase.connect(this.sqlite)
      const articles: Article[] = await database.getSelectedArticles(this.format == 'html' ? undefined : this.data)

      switch (this.format) {
        case 'csv':
          jsonexport(articles, { rowDelimiter: ',', forceTextDelimiter: true }, (err: any, csv: any) => {
            if (err) return console.log(err)
            console.log(csv)
          })
          break
        case 'table':
          const data = articles.map((article: any) => {
            const columns: any[] = []
            for (const key in article)
              columns.push(article[key])
            return columns
          })
          console.log(table(data))
          break
        case 'html':
          const html = mustache.render(template, { articles })
          console.log(html)
          break
        default:
          console.log(Color.red(`Unknown format: ${this.format}`))
      }
      this.download(articles)

    }
  }

  public verifyOptions() {
    if (!this.sqlite)
      throw new Error('No sqlite database chosen!')
  }

  public download(articles: Article[]) {
    if (this.scihub !== undefined) {
      if (this.data !== undefined && this.data.indexOf('doi') === -1) {
        console.error(Color.yellow('"doi" must be in data for pdf files to be downloaded, skipping download...'))
        return
      }
      // create export folder if not exists
      const dir = 'export' //TODO: convert to config option
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      // download each article
      articles.forEach(async article => {
        // sleep to avoid captchas
        await delay(Math.random() * (2 * 1000))

        const url = `${this.scihub}/${article.doi}`
        const scihubHtml = await axios.get(url)
        const $doc = cheerio.load(scihubHtml.data)
        const iframe = $doc('iframe')

        let pdfUrl = iframe.attr('src')
        if (iframe !== undefined && pdfUrl !== undefined) {
          pdfUrl = pdfUrl.substring(0, 2) == "//" ? "https:" + pdfUrl : pdfUrl
          axios({
            method: 'get',
            url: pdfUrl,
            responseType: 'stream',
            timeout: 25000 // 25s
          }).then((response) => {
            const name = article.title ? article.title : article.doi
            //TODO: make name only have ascii chars
            response.data.pipe(fs.createWriteStream(`${dir}/${name}.pdf`), { flags: 'w' });
          }).catch((e) => {
            console.error(Color.red('Unable to download:'))
            console.error(article)
          })
        } else {
          console.error(Color.red('Unable to download (not available)'))
          console.error(article)
        }
      })
    }
  }
}
