#!/usr/bin/env node

import { SplurtData } from '../command/SplurtData'

import Color from 'colors'
import program from 'commander'
import YAML from 'yamljs'

program
  .version('0.0.13')

  .option('-p, --project <file>', 'Read config from project YAML file.')
  .option('-d, --delay <s>', 'Delay between requests.', 10)
  .option('-c, --cookie <c>', 'Cookie to add to header.')
  .option('-s, --sqlite <database>', 'SQLite database used to store articles.')

  .parse(process.argv)

const splurt = new SplurtData(program.delay, program.cookie, program.sqlite)

if (program.project) {
  try {
    const options = YAML.load(program.project)
    
    if (options.data) {
      splurt.delay = options.data.delay || splurt.delay
      splurt.cookie = options.data.cookie || splurt.cookie
    }
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
