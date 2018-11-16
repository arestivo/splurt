import { expect } from 'chai'
import { DBLPScraper } from '../src/scraper/DBLPScraper'

describe('DBLPScraper', () => {

  it('should return articles', (done) => {
    let dblp = new DBLPScraper()
    dblp.query('blockchain')
    .then(function(articles) {
      try {
        expect(articles.length).to.be.greaterThan(0)
        done()  
      } catch(err) {
        done(err)
      }
    }, done)
  }),

  it('should contain relevant articles only', (done) => {
    let dblp = new DBLPScraper()
    dblp.query('blockchain')
    .then(function(articles) {
      try {
        let relevant = articles.filter((article : any) => article.title.toLowerCase().includes('blockchain'))
        expect(articles.length).to.be.equal(relevant.length)
        done()  
      } catch(err) {
        done(err)
      }
    }, done)
  })

  it('should contain only the right amount of articles', (done) => {
    let dblp = new DBLPScraper()
    dblp.query('blockchain', 5)
    .then(function(articles) {
      try {
        expect(articles.length).to.be.equal(5)
        done()  
      } catch(err) {
        done(err)
      }
    }, done)
  })

})