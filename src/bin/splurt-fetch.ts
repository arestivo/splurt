#!/usr/bin/env node

import { SplurtFetch } from '../command/SplurtFetch'
import { ArticleDatabase } from '../database/ArticleDatabase'

import Color from 'colors'
import program from 'commander'
import YAML from 'yamljs'

(async () => {
  const list = (l: string) => l.split(',').map(v => v.trim())

  program
    .version('0.0.1')

    .option('-p, --project <file>', 'Read config from project YAML file.')
    .option('-q, --query <q>', 'Search query', '')
    .option('-d, --databases <list>', 'Comma separated list of databases to search.', list, [])
    .option('-m, --max [n]', 'Maximum number of results.', 10)
    .option('-s, --sqlite <database>', 'SQLite database used to store articles.', undefined)

    .parse(process.argv)

  const splurt = new SplurtFetch(program.query, program.maximum, program.databases)
  let sqlite: string = program.sqlite

  if (program.project) {
    try {
      const options = YAML.load(program.project)

      if (options.fetch) {
        splurt.query = options.fetch.query || splurt.query
        splurt.maximum = options.fetch.maximum || splurt.maximum
      }

      splurt.databases = options.fetch.databases || splurt.databases

      sqlite = options.sqlite || program.sqlite
    } catch (e) {
      console.error(Color.red(e.message))
      process.exit()
    }
  }

  try {
    const articles = await splurt.execute()

    if (sqlite) {
      const database = await ArticleDatabase.connect(sqlite)
      await database.replace(articles)
    } else console.log(articles)
  } catch (e) {
    console.error(Color.red(e.message))
  }
})()
