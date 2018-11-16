import { Article } from "../data/Article"
import axios, { AxiosRequestConfig } from 'axios'

abstract class Scraper {
  abstract async query(q : string, maximum : number) : Promise<any>

  get(url : string, params : any) {
    return axios.get('http://dblp.org/search/publ/api', {params: params})
  }
}

export {Scraper}