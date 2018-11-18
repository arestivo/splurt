#!/usr/bin/env node

import { SplurtExclude } from '../command/SplurtExclude'

import program from 'commander'
import Color from 'colors'
import YAML from 'yamljs'

function list(l : string) : string[] {
  return l.split(',').map(v => v.trim());
}

program
  .version('0.0.1')

  .option('-p, --project <file>', 'Read config from project YAML file.')
  .option('-e, --exclude <criteria>', 'Comma separated exclusion criteria using SQL.', list)
  .option('-s, --sqlite <database>', 'SQLite database used to store articles.')

  .parse(process.argv);

const splurt = new SplurtExclude

if (program.project) {
  try {
    const options = YAML.load(program.project)

    splurt.criteria = options.exclude.criteria
    splurt.sqlite = options.sqlite
  } catch (e) {
    console.error(Color.red(e.message))
    process.exit()
  }
} 

splurt.criteria = program.exclude ? program.exclude : splurt.criteria  
splurt.sqlite = program.sqlite ? program.sqlite : splurt.sqlite 

try {  
  splurt.execute().catch(function(e : any){
    console.error(Color.red(e.message))
  })
} catch(e) {
  console.error(Color.red(e.message))
}
