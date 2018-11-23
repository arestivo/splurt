import { Scraper } from '../Scraper'
import cheerio from 'cheerio'

export class AbstractScraper extends Scraper {
  public static async getAbstract(url: string) {
    const html = await AbstractScraper.get(url, {})
    const $ = cheerio.load(html.data)
    if (url) {
      const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)
      if (matches && matches[1]) {
        const host = matches[1]

        switch (host) {
          case 'ieeexplore.ieee.org':
            return $('div.abstract-desktop-div-sections div div').text()
          case 'arxiv.org':
            return $('blockquote.abstract').text().slice('Abstract: '.length)
          case 'dl.acm.org':
            const dlHtml = await AbstractScraper.get(`${url}&preflayout=flat`, {})
            const $dl = cheerio.load(dlHtml.data)
            return $dl('div.flatbody p').text()
          case 'link.springer.com':
            return $('section.Abstract p').text()
          case 'www.sciencedirect.com':
            return $('#abstracts p').toArray().map(p => $(p).text()).join(' ')
          case 'www.computer.org':
            return $('div.abstractText').text()
          case 'pdfs.semanticscholar.org':
            return ''
          default:
            return `NOT IMPLEMENTED YET: ${host}`
        }
      }
    }
    return `COULD NOT FIND HOST: ${url}`
  }
}
