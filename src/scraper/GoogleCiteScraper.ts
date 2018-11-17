import { CiteScraper } from "./CiteScraper";
import { Article } from "../data/Article";
import cheerio from 'cheerio';
import delay from 'delay';

class GoogleCiteScraper extends CiteScraper{
  delay : number = 2
  cookie : string | undefined

  constructor(delay : number, cookie : string | undefined) {
    super()
    if (delay) this.delay = 2
    this.cookie = cookie
  }

  async getCiteCount(article: Article) : Promise<number | undefined> {
    await delay(Math.random() * (this.delay * 1000))
    
    const html = await this.get(
      'https://scholar.google.com/scholar', 
      {q : article.title}, {
        Cookie: this.cookie
      }
    )
    const $ = cheerio.load(html.data)
    const links = $('div.gs_r:first-child .gs_ri .gs_fl a')

    let number : number | undefined = undefined
    links.each(function(i, element){
      const text = $(element).text()
      if (text.startsWith('Cited by')) {
        const matches = text.match(/\d+/)
        const match = matches == null ? undefined : matches[0]
        if (match != null)
          number = parseInt(match)
      }
      if (number == undefined) number = 0
    })

    return number
  }
}

export { GoogleCiteScraper }