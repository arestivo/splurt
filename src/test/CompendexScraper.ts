import {expect} from 'chai'
import {CompendexScraper} from "../scraper/CompendexScraper";
import * as fs from "fs";
import {Article} from "../data/Article";

const COMPENDEX_JSON_RESPONSE = JSON.parse(fs.readFileSync("./examples/engineering_village.json", 'utf8'));

describe('CompendexScraper', () => {
    it('should return all articles from JSON correctly scraped', () => {
        const scraper = new CompendexScraper();
        const articles = scraper.scrape(COMPENDEX_JSON_RESPONSE);
        const expected: Article = {
            title: 'Internet of Things (IoT): Research, Simulators, and Testbeds',
            doi: '10.1109/JIOT.2017.2786639',
            origin: 'Compendex',
            year: 2018
        };

        expect(articles.length).to.be.equal(50);
        expect(articles[0]).to.eql(expected);

        articles.forEach(article => expect(article.year).to.be.lessThan(2050).and.greaterThan(1900));
    })

    it('should parse the year of all articles correctly', () => {
        const scraper = new CompendexScraper();
        const articles = scraper.scrape(COMPENDEX_JSON_RESPONSE);

        articles.forEach(article => expect(article.year).to.be.lessThan(2050).and.greaterThan(1900));
    })
});
