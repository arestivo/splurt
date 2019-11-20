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
      if (!fs.existsSync(dir)) fs.mkdirSync(dir)
      const errorLog = `${dir}/error_log.txt`

      // create stream for error log
      if (fs.existsSync(errorLog)) fs.unlinkSync(errorLog)
      let pdfErrorLog = fs.createWriteStream(errorLog, { flags: 'a' })

      // download each article
      articles.forEach(async article => {
        // sleep to avoid captchas
        await delay(Math.random() * (2 * 1000))

        // get scihub page
        const url = `${this.scihub}/${article.doi}`
        const scihubHtml = await axios.get(url).catch(() => {
          pdfErrorLog.write(`Unable to access scihub for:\n${JSON.stringify(article)}\n-----\n`)
          return
        })
        if (scihubHtml === undefined) return
        // get the pdf url from that page
        const $doc = cheerio.load(scihubHtml.data)
        const iframe = $doc('iframe')
        //download pdf from iframe src
        let pdfUrl = iframe.attr('src')
        if (iframe !== undefined && pdfUrl !== undefined) {
          let sanitize = require("sanitize-filename")
          // fix urls that are missing the protocol
          pdfUrl = pdfUrl.substring(0, 2) == "//" ? "https:" + pdfUrl : pdfUrl
          axios({
            method: 'get',
            url: pdfUrl,
            responseType: 'stream',
            timeout: 25000 // 25s
          }).then((response) => {
            const filename = sanitize(article.title ? article.title : article.doi)
            response.data.pipe(fs.createWriteStream(`${dir}/${filename}.pdf`), { flags: 'w' })
          }).catch((e) => {
            pdfErrorLog.write(`Unable to download:\n${JSON.stringify(article)}\n${e}\n-----\n`)
          })
        } else {
          pdfErrorLog.write(`Unable to download:\n${JSON.stringify(article)}\n-----\n`)
        }
      })
      //delete error log if empty
      if (fs.statSync(errorLog).size == 0) fs.unlinkSync(errorLog)
    }
  }
}
