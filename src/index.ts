import yargs from 'yargs'

import { Config, loadConfig } from './config'
import { filesystem } from './file-system'
import { initSneedEnvironment } from './init'
;(async () => {
  process.on('unhandledRejection', err => {
    console.error(err)
    console.error('Sneed crashed...')
    process.exit(1)
  })

  const cli = yargs
    .usage('Usage: $0 <template> [options] [variables]')
    .command('init', 'initialize environment (create .sneedrc and templates folder)')
    .command('<template>', 'scaffold a <template>', args => {
      return args.demandCommand()
    })
    .demandCommand(1)
    .option('override', {
      coerce: Boolean,
      default: false,
      description: 'turns off existing file protection (can override existing files). !DATA LOSS DANGER!'
    })
    .help('h')
    .alias('h', 'help')
    .example('$0', 'some_template --var1 4 --var2 7').argv

  if (cli._[0] === 'init') {
    let cfg: Config | null = null
    try {
      cfg = await loadConfig()
      console.log('Configuration found')
    } catch {
      console.log('No configuration found, will create')
    }

    await initSneedEnvironment(cfg, filesystem)
  }
})()
