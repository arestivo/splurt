#!/usr/bin/env node

import { SplurtExclude } from '../command/SplurtExclude'

import Color from 'colors'
import program from 'commander'
import YAML from 'yamljs'
import { SplurtExport } from '../command/SplurtExport'

const list = (l: string) => l.split(',').map(v => v.trim())

program
  .version('0.0.13')

  .option('-p, --project <file>', 'Read config from project YAML file.')
  .option('-f, --format <format>', 'Export format.', 'csv')
  .option('-d, --data <list>', 'Data columns to export (id, title, authors, year, publication, doi, type, origin, cites, abstract).', list)
  .option('-s, --sqlite <database>', 'SQLite database used to store articles.')
  .option('-h, --scihub <url>', 'Working url for sci-hub, if not specified no pdfs will be downloaded')

  .parse(process.argv)

const splurt = new SplurtExport(program.format, program.sqlite, program.data, program.scihub)

if (program.project) {
  try {
    const options = YAML.load(program.project)

    if (options.export) {
      splurt.format = options.export.format || splurt.format
      splurt.data = options.export.data || splurt.data
      splurt.scihub = options.export.scihub || splurt.scihub
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
