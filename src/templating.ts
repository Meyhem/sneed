import _ from 'lodash'
import ejs from 'ejs'
import path from 'path'
import * as casing from 'change-case'

import { Command, Config } from './config'
import { SneedError } from './errors'
import { Dictionary } from './types'
import { FilesystemApi } from './file-system'

type Variables = Dictionary<string>

function prepareVariables(variables: Variables, cmd: Command): Variables {
  return {
    ..._.defaultsDeep(
      variables,
      _.mapValues(cmd.variables, v => v.default)
    ),
    casing: casing
  }
}

function assertVariablesReady(variables: Variables) {
  _.forEach(variables, (v, k) => {
    if (_.isUndefined(v)) {
      throw new SneedError(
        `Variable '${k}' is not defined. Either pass cli argument '--${k} your_value' or add 'default' value in command variables config`
      )
    }
  })
}

function executeTemplateString(templateString: string, variables: Variables): string {
  return ejs.render(templateString, variables)
}

export async function runCommand(
  command: string,
  variables: Variables,
  config: Config,
  override: boolean,
  fs: FilesystemApi
) {
  const cmd = config.commands[command]

  variables = prepareVariables(variables, cmd)
  assertVariablesReady(variables)

  for (const scaffold of cmd.scaffolds) {
    const templatePath = executeTemplateString(path.join(config.templateFolder, scaffold.template), variables)
    const targetPath = executeTemplateString(scaffold.target, variables)

    if (!(await fs.exists(templatePath))) {
      throw new SneedError(`Template file '${templatePath}' does not exist.`)
    }

    if (!override && (await fs.exists(targetPath))) {
      throw new SneedError(
        `Target file '${targetPath}' already exists. Refusing to override to prevent data loss. Use option '--override' if this is intentional.`
      )
    }

    const template = await fs.readFile(templatePath)
    const rendered = executeTemplateString(template, variables)

    const dir = path.parse(targetPath).dir
    await fs.createDir(dir)

    await fs.writeFile(targetPath, rendered)
    console.log(`+ ${targetPath}`)
  }
}
