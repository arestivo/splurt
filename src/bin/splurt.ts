#!/usr/bin/env node

import { Splurt } from '../app/Splurt'
import program from 'commander'
import Color from 'colors'

program
  .version('0.0.1')

  .option('-q, --query <q>', 'Search query')

  .option('--dblp', 'Search DBLP database')
  .option('--compendex', 'Search Compendex database')
  .option('--scopus', 'Search Scopus database')

  .option('-m, --max [n]', 'Maximum number of results', 10)

  .parse(process.argv);

const splurt = new Splurt

splurt.query = program.query

splurt.dblp = program.dblp
splurt.compendex = program.compendex
splurt.scopus = program.scopus

splurt.maximum = program.max

try {
  splurt.execute()
} catch(e) {
  console.log(Color.red(e.message))
}
