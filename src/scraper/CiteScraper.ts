import { Article } from '../data/Article'
import { Scraper } from './Scraper'

export abstract class CiteScraper extends Scraper {
  public abstract async getCiteCount(article: Article): Promise<number | undefined>
}
