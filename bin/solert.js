#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBLPScraper_1 = require("../src/scraper/DBLPScraper");
let minimist = require('minimist');
var args = minimist(process.argv.slice(2), {
    string: 'query',
    boolean: ['dblp'],
    alias: { q: 'query' }
});
if (!args['q']) {
    console.log('No query given!');
    console.log('Try adding option: --query \'blockchain\'');
    process.exit();
}
if (!args['dblp']) {
    console.log('No research database chosen!');
    console.log('Try adding option: --dblp');
    process.exit();
}
if (args['dblp']) {
    let dblp = new DBLPScraper_1.DBLPScraper();
    dblp.query(args['q']);
}
