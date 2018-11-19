#!/usr/bin/env node

import { SplurtExclude } from '../command/SplurtExclude'

import Color from 'colors'
import program from 'commander'
import YAML from 'yamljs'

const list = (l: string) => l.split(',').map(v => v.trim())

program
  .version('0.0.1')

  .option('-p, --project <file>', 'Read config from project YAML file.')
  .option('-e, --exclude <criteria>', 'Comma separated exclusion criteria using SQL.', list)
  .option('-s, --sqlite <database>', 'SQLite database used to store articles.')

  .parse(process.argv)

const splurt = new SplurtExclude(program.exclude, program.sqlite)

if (program.project) {
  try {
    const options = YAML.load(program.project)

    splurt.criteria = options.exclude.criteria || splurt.criteria
    splurt.sqlite = options.sqlite || splurt.sqlite
  } catch (e) {
    console.error(Color.red(e.message))
    process.exit()
  }
}

try {
  splurt.execute().catch(e => console.error(Color.red(e.message)))
} catch (e) {
  console.error(Color.red(e.message))
}
