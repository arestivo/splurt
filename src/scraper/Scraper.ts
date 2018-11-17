import axios, { AxiosRequestConfig } from 'axios'

abstract class Scraper {
  get(url : string, params : any, headers : any = undefined) {
    return axios.get(url, {params, headers})
  }
}

export { Scraper }