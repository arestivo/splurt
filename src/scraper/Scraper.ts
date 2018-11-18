import axios, { AxiosRequestConfig } from 'axios'

abstract class Scraper {
  public get(url: string, params: any, headers?: any) {
    return axios.get(url, {params, headers})
  }
}

export { Scraper }
