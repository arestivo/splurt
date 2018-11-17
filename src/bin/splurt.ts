#!/usr/bin/env node

import program from 'commander'

program
  .version('0.0.1')

  .command('fetch', 'Fetch article data from selected research databases.').alias('f')
  .command('complete', 'Complete citation data for fetched articles.').alias('c')

  .parse(process.argv)