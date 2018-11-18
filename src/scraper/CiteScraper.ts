import { Scraper } from './Scraper'
import { Article } from '../data/Article'

abstract class CiteScraper extends Scraper {
  public abstract async getCiteCount(article: Article): Promise<number | undefined>
}

export { CiteScraper }
