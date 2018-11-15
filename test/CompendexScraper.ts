import {expect} from 'chai'
import {CompendexScraper} from "../src/scraper/CompendexScraper";
import * as fs from "fs";

const COMPENDEX_JSON_RESPONSE = JSON.parse(fs.readFileSync("./examples/engineering_village.json", 'utf8'));

describe('CompendexScraper', () => {
    it('should return articles from JSON ', () => {
        let scraper = new CompendexScraper();
        let articles = scraper.scrape(COMPENDEX_JSON_RESPONSE);

        expect(articles.length).to.be.equal(50);
        // @ts-ignore FIXME: Remove when Article has a field `title`
        expect(articles[0].title).to.be.equal('Internet of Things (IoT): Research, Simulators, and Testbeds');
    })
});
