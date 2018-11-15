"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = require("../data/Article");
const Scraper_1 = require("./Scraper");
class DBLPScraper extends Scraper_1.Scraper {
    async query(q) {
        this.get('http://dblp.org/search/publ/api', { q: q, format: 'json' })
            .then(function (response) {
            let hits = response.data.result.hits.hit;
            hits.forEach((hit) => {
                console.log(hit.info.title);
            });
        });
        return [new Article_1.Article()];
    }
}
exports.DBLPScraper = DBLPScraper;
