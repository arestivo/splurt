#!/usr/bin/env node

import { Splurt } from '../src/app/Splurt'

let minimist = require('minimist')

var args = minimist(process.argv.slice(2), {
  string: 'query',          // -q string
  boolean: ['dblp'],        // --dblp
  alias: { q: 'query' }
})

const splurt = new Splurt

if (!args['q']) {
  console.log('No query given!')
  console.log('Try adding option: --query \'blockchain\'')
  process.exit()
} else splurt.query = args['q']

if (!args['dblp']) {
  console.log('No research database chosen!')
  console.log('Try adding option: --dblp')
  process.exit()
} else splurt.dblp = true

splurt.execute()