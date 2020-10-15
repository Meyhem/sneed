import _ from 'lodash'
import ejs from 'ejs'
import path from 'path'
import * as casing from 'change-case'

import { Command, Config } from './config'
import { SneedError } from './errors'
import { Dictionary } from './types'
import { FilesystemApi } from './file-system'

type Variables = Dictionary<string>

export function prepareVariables(variables: Variables, cmd: Command): Variables {
  return {
    ..._.defaultsDeep(
      variables,
      _.mapValues(cmd.variables, v => v.default)
    ),
    casing: casing,
    path: path
  }
}

export function assertVariablesReady(variables: Variables) {
  _.forEach(variables, (v, k) => {
    if (_.isUndefined(v)) {
      throw new SneedError(
        `Variable '${k}' is not defined. Either pass cli argument '--${k} your_value' or add 'default' value in command variables config`
      )
    }
  })
}

export function executeTemplateString(templateString: string, variables: Variables, templateFolder: string): string {
  return ejs.render(templateString, variables, {
    filename: path.join(templateFolder, 'sneed-execution'),
    root: templateFolder
  })
}

export async function executeScaffolds(cmd: Command, variables: Variables, config: Config, fs: FilesystemApi) {
  for (const scaffold of cmd.scaffolds) {
    const templatePath = path.join(config.templateFolder, scaffold.template)
    const targetPath = scaffold.target

    let renderedTemplatePath
    let renderedTargetPath
    try {
      renderedTemplatePath = executeTemplateString(templatePath, variables, config.templateFolder)
    } catch (e) {
      throw new SneedError(`'template' path '${templatePath}' contains EJS error: ${e.message}`)
    }

    try {
      renderedTargetPath = executeTemplateString(targetPath, variables, config.templateFolder)
    } catch (e) {
      throw new SneedError(`'target' path '${targetPath}' contains EJS error: ${e.message}`)
    }

    if (!(await fs.exists(renderedTemplatePath))) {
      throw new SneedError(`'template' file '${renderedTemplatePath}' does not exist`)
    }

    if (!config.override && (await fs.exists(renderedTargetPath))) {
      throw new SneedError(
        `Target file '${renderedTargetPath}' already exists. Refusing to override to prevent data loss. Use option '--override' if this is intentional`
      )
    }

    const template = await fs.readFile(renderedTemplatePath)
    let renderedTemplate
    try {
      renderedTemplate = executeTemplateString(template, variables, config.templateFolder)
    } catch (e) {
      throw new SneedError(`Template file '${renderedTemplatePath}' contains EJS error: ${e.message}`)
    }

    const dir = path.parse(renderedTargetPath).dir
    if (dir) {
      await fs.createDir(dir)
    }

    await fs.writeFile(renderedTargetPath, renderedTemplate)
    console.log(`+ ${renderedTargetPath}`)
  }
}

export async function executeEdits(cmd: Command, variables: Variables, config: Config, fs: FilesystemApi) {
  for (const edit of cmd.edits) {
    const templatePath = path.join(config.templateFolder, edit.template)
    let renderedTemplatePath
    let renderedTargetPath
    let renderedMark

    try {
      renderedTemplatePath = executeTemplateString(templatePath, variables, config.templateFolder)
    } catch (e) {
      throw new SneedError(`'template' path '${templatePath}' contains EJS error: ${e.message}`)
    }

    try {
      renderedTargetPath = executeTemplateString(edit.target, variables, config.templateFolder)
    } catch (e) {
      throw new SneedError(`'target' path '${edit.target}' contains EJS error: ${e.message}`)
    }

    try {
      renderedMark = executeTemplateString(edit.mark, variables, config.templateFolder)
    } catch (e) {
      throw new SneedError(`'mark' path '${edit.mark}' contains EJS error: ${e.message}`)
    }

    if (!(await fs.exists(renderedTemplatePath))) {
      throw new SneedError(`'template' file '${renderedTemplatePath}' does not exist`)
    }

    if (!(await fs.exists(renderedTargetPath))) {
      throw new SneedError(`'target' file '${renderedTargetPath}' does not exist`)
    }

    const template = await fs.readFile(renderedTemplatePath)
    let renderedTemplate
    try {
      renderedTemplate = executeTemplateString(template, variables, config.templateFolder)
    } catch (e) {
      throw new SneedError(`Template '${renderedTemplatePath}' contains EJS error: ${e.message}`)
    }
    const editedFile = await fs.readFile(renderedTargetPath)

    let replaceBy
    switch (edit.editType) {
      case 'insertAfter':
        replaceBy = renderedMark + renderedTemplate
        break
      case 'insertBefore':
        replaceBy = renderedTemplate + renderedMark
        break
      case 'replace':
        replaceBy = renderedTemplate
        break
      default:
        throw new Error('unreachable')
    }

    const editedResult = editedFile.replace(renderedMark, replaceBy)

    await fs.writeFile(renderedTargetPath, editedResult)
    console.log(`~ ${renderedTargetPath}`)
  }
}

export async function executeCommand(command: string, variables: Variables, config: Config, fs: FilesystemApi) {
  const cmd = config.commands[command]

  variables = prepareVariables(variables, cmd)
  assertVariablesReady(variables)

  await executeScaffolds(cmd, variables, config, fs)
  await executeEdits(cmd, variables, config, fs)
}
