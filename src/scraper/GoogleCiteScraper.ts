import { CiteScraper } from './CiteScraper'
import { Article } from '../data/Article'
import cheerio from 'cheerio';
import delay from 'delay'

class GoogleCiteScraper extends CiteScraper {
  constructor(public throttle: number = 2, public cookie?: string) {
    super()
  }

  public async getCiteCount(article: Article): Promise<number | undefined> {
    await delay(Math.random() * (this.throttle * 1000))

    const html = await this.get(
      'https://scholar.google.com/scholar', 
      {q : article.title}, {
        Cookie: this.cookie
      }
    )

    const $ = cheerio.load(html.data)
    const links = $('div.gs_r:first-child .gs_ri .gs_fl a')

    let n: number = 0

    links.each((i, element) => {
      const text = $(element).text()
      if (text.startsWith('Cited by')) {
        const matches = text.match(/\d+/)
        const match = matches == null ? undefined : matches[0]
        if (match !== undefined) n = parseInt(match)
      }
    })

    return n
  }
}

export { GoogleCiteScraper }
