#!/usr/bin/env node

import { Splurt } from '../src/app/Splurt'
const program = require('commander');

program
  .version('0.0.1')
  .option('--dblp', 'Search DBLP database')
  .option('--compendex', 'Search Compendex database')
  .option('--scopus', 'Search Scopus database')
  .option('-q, --query <q>', 'Search query')
  .parse(process.argv);

if (!program.dblp && !program.compendex && !program.scopus) {
  console.log('No research database chosen!')
  console.log('Try adding option: --dblp')
  process.exit()
}

if (!program.query) {
  console.log('No query given!')
  console.log('Try adding option: --query \'blockchain\'')
  process.exit()
}

const splurt = new Splurt

splurt.query = program.query

splurt.dblp = program.dblp
splurt.compendex = program.compendex
splurt.scopus = program.scopus

splurt.execute()