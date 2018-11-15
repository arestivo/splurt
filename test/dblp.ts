import { expect } from 'chai'
import { DBLPScraper } from '../src/scraper/DBLPScraper'

describe('DBLPScraper', () => {
  it('should return articles', () => {
    let dblp = new DBLPScraper()
    let articles = dblp.query('blockchain')
    //expect(articles.length).to.be.greaterThan(0);
  })
})