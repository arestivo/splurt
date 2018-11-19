import { Scraper } from './Scraper'

export abstract class ArticleScraper extends Scraper {
  public get(url = 'http://dblp.org/search/publ/api', params: any) {
    return super.get(url, params)
  }
}
