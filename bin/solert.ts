#!/usr/bin/env node

import { DBLPScraper } from '../src/scraper/DBLPScraper'
import { Article } from '../src/data/Article';

let minimist = require('minimist')

var args = minimist(process.argv.slice(2), {
  string: 'query',          // -q string
  boolean: ['dblp'],        // --dblp
  alias: { q: 'query' }
})

if (!args['q']) {
  console.log('No query given!')
  console.log('Try adding option: --query \'blockchain\'')
  process.exit()
}

if (!args['dblp']) {
  console.log('No research database chosen!')
  console.log('Try adding option: --dblp')
  process.exit()
}

if (args['dblp']) {
  let dblp = new DBLPScraper()
  dblp.query(args['q'])
  .then(function(articles : any[]) {
    console.log(articles)
  })
}