import axios from 'axios'

export abstract class Scraper {
  protected static get(url: string, params: any, headers?: any) {
    return axios.get(url, { params, headers })
  }
}
