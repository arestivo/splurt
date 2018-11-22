import { Article } from '../../data/Article'
import { Scraper } from '../Scraper'

export abstract class DataScraper extends Scraper {
  public abstract async getData(article: Article): Promise<Article>
}
