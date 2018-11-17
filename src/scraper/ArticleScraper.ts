import { Article } from "../data/Article"
import { Scraper } from "./Scraper";
import axios, { AxiosRequestConfig } from 'axios'

abstract class ArticleScraper extends Scraper{
  get(url : string, params : any) {
    return axios.get('http://dblp.org/search/publ/api', {params: params})
  }
}

export { ArticleScraper }