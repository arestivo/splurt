#!/usr/bin/env node

import { Splurt } from '../app/Splurt'
import program from 'commander'
import Color from 'colors'
import YAML from 'yamljs'

program
  .version('0.0.1')

  .option('-q, --query <q>', 'Search query')

  .option('-p, --project <file>', 'Read config from project file')

  .option('--dblp', 'Search DBLP database')
  .option('--compendex', 'Search Compendex database')
  .option('--scopus', 'Search Scopus database')
  .option('--inspec', 'Search Inspec database')

  .option('-m, --max [n]', 'Maximum number of results', 10)

  .parse(process.argv);

const splurt = new Splurt

if (program.project) {
try {
  const options = YAML.load(program.project)

  splurt.query = options.query
  splurt.maximum = options.maximum

  if (options.databases)
    options.databases.forEach((database : string) => splurt.addDatabase(database))
  } catch (e) {
    console.log(Color.red(e.message))
  }
}

splurt.query = program.query ? program.query : splurt.query
splurt.dblp = program.dblp ? program.dblp : splurt.dblp 
splurt.compendex = program.compendex ? program.compendex : splurt.compendex 
splurt.scopus = program.scopus ? program.scopus : splurt.scopus
splurt.inspec = program.inspec ? program.inspec : splurt.inspec

splurt.maximum = program.max ? program.max : splurt.maximum

try {
  splurt.execute()
} catch(e) {
  console.log(Color.red(e.message))
}
