#!/usr/bin/env node

import { SplurtCitations } from '../command/SplurtCitations'

import Color from 'colors'
import program from 'commander'
import YAML from 'yamljs'

program
  .version('0.0.1')

  .option('-p, --project <file>', 'Read config from project YAML file.')
  .option('-d, --delay <s>', 'Delay between requests.', 2)
  .option('-c, --cookie <c>', 'Cookie to add to header.')
  .option('-s, --sqlite <database>', 'SQLite database used to store articles.')

  .parse(process.argv)

const splurt = new SplurtCitations()

if (program.project) {
  try {
    const options = YAML.load(program.project)

    splurt.delay = program.delay || options.citations.delay || splurt.delay
    splurt.cookie = program.cookie || options.citations.cookie || splurt.cookie
    splurt.sqlite = program.sqlite || options.sqlite || splurt.sqlite
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
