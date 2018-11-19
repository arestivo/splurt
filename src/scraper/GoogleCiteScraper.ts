import { Article } from '../data/Article'
import { CiteScraper } from './CiteScraper'

import cheerio from 'cheerio'
import delay from 'delay'

export class GoogleCiteScraper extends CiteScraper {
  constructor(public throttle: number = 2, public cookie?: string) {
    super()
  }

  public async getCiteCount(article: Article): Promise<number | undefined> {
    await delay(Math.random() * (this.throttle * 1000))

    const html = await this.get(
      'https://scholar.google.com/scholar',
      { q: article.title }, { Cookie: this.cookie }
    )

    const $ = cheerio.load(html.data)
    const links = $('div.gs_r:first-child .gs_ri .gs_fl a')

    links.each((_, element) => {
      const text = $(element).text()
      if (text.startsWith('Cited by')) {
        const matches = text.match(/\d+/)
        if (matches !== null) return parseInt(matches[0])
      }
    })

    return 0
  }
}
