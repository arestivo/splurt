#!/usr/bin/env node

import { SplurtFetch } from '../command/SplurtFetch'
import { ArticleDatabase } from '../database/ArticleDatabase'

import program from 'commander'
import Color from 'colors'
import YAML from 'yamljs'

function list(l: string): string[] {
  return l.split(',').map(v => v.trim())
}

program
  .version('0.0.1')

  .option('-p, --project <file>', 'Read config from project YAML file.')
  .option('-q, --query <q>', 'Search query')
  .option('-d, --databases <list>', 'Comma separated list of databases to search.', list)
  .option('-m, --max [n]', 'Maximum number of results.')
  .option('-s, --sqlite <database>', 'SQLite database used to store articles.')
  .option('--verbose <database>', 'Verbose output.')

  .parse(process.argv)

const splurt = new SplurtFetch()
let sqlite: string

if (program.project) {
  try {
    const options = YAML.load(program.project)

    splurt.query = options.fetch.query
    splurt.maximum = options.fetch.maximum
    splurt.databases = options.fetch.databases
    sqlite = options.sqlite
  } catch (e) {
    console.error(Color.red(e.message))
    process.exit()
  }
}

splurt.query = program.query ? program.query : splurt.query
splurt.databases = program.databases ? program.databases : splurt.databases
splurt.maximum = program.max ? program.max : splurt.maximum
sqlite = program.sqlite ? program.sqlite : sqlite

splurt.execute()
  .then(articles => {
    if (sqlite) {
      const database = new ArticleDatabase(sqlite)
      database.init(() => database.replace(articles))
    } else console.log(articles)
  })
  .catch(e => console.error(Color.red(e.message)))
