import _ from 'lodash'
import path from 'path'
import yargs from 'yargs'

import { Config, loadConfig } from './config'
import { SneedError } from './errors'
import { filesystem } from './file-system'
import { initSneedEnvironment as initEnvironment } from './init'
import { executeCommand } from './templating'

async function main() {
  process.on('unhandledRejection', err => {
    console.error(err)
    console.error(
      'Sneed crashed... If you this its a bug please submit an issue https://github.com/Meyhem/sneed/issues'
    )
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
      type: 'boolean',
      default: false,
      description: 'turns off existing file protection (can override existing files). !DATA LOSS DANGER!'
    })
    .help('h')
    .alias('h', 'help')
    .example('$0', 'some_template --var1 4 --var2 7').argv as Record<string, string>

  const command = cli._[0]

  if (command === 'init') {
    let cfg: Config | null = null

    try {
      cfg = await loadConfig()
      console.log('Configuration found')
    } catch {
      console.log('No configuration found, creating')
    }

    await initEnvironment(cfg, filesystem)
    process.exit(0)
  }

  const config = await loadConfig()

  if (_.includes(_.keys(config.commands), command)) {
    const vars = _.mapValues(_.omit(cli, ['_', '$0', 'override']), _.toString)
    config.override = !!cli.override
    config.templateFolder = path.resolve(config.templateFolder)
    await executeCommand(command, vars, config, filesystem)
    process.exit(0)
  }

  throw new SneedError(`Command '${command}' is not builtin or defined in config`)
}

main().catch(err => {
  if (err.isSneedError) {
    console.error(err.message)
    process.exit(1)
  } else {
    throw err
  }
})
