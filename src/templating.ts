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
    const templatePath = path.join(config.templateFolder, scaffold.template)
    const targetPath = scaffold.target

    let renderedTemplatePath
    let renderedTargetPath
    try {
      renderedTemplatePath = executeTemplateString(templatePath, variables)
    } catch (e) {
      throw new SneedError(`'template' path '${templatePath}' contains EJS error: ${e.message}`)
    }

    try {
      renderedTargetPath = executeTemplateString(targetPath, variables)
    } catch (e) {
      throw new SneedError(`'target' path '${targetPath}' contains EJS error: ${e.message}`)
    }

    if (!(await fs.exists(renderedTemplatePath))) {
      throw new SneedError(`Template file '${renderedTemplatePath}' does not exist.`)
    }

    if (!override && (await fs.exists(renderedTargetPath))) {
      throw new SneedError(
        `Target file '${renderedTargetPath}' already exists. Refusing to override to prevent data loss. Use option '--override' if this is intentional.`
      )
    }

    const template = await fs.readFile(renderedTemplatePath)
    const rendered = executeTemplateString(template, variables)

    const dir = path.parse(renderedTargetPath).dir
    await fs.createDir(dir)

    await fs.writeFile(renderedTargetPath, rendered)
    console.log(`+ ${renderedTargetPath}`)
  }
}
