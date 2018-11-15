"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBLPScraper_1 = require("../src/scraper/DBLPScraper");
describe('DBLPScraper', () => {
    it('should return articles', () => {
        let dblp = new DBLPScraper_1.DBLPScraper();
        let articles = dblp.query('blockchain');
        //expect(articles.length).to.be.greaterThan(0);
    });
});
