import _ from 'lodash'
import { Command, Config } from './config'
import { SneedError } from './errors'
import { Dictionary } from './types'

type Variables = Dictionary<string>

function prepareVariables(variables: Variables, cmd: Command): Variables {
  return _.defaultsDeep(
    variables,
    _.mapValues(cmd.variables, v => v.default)
  )
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

export async function runCommand(command: string, variables: Variables, config: Config) {
  const cmd = config.commands[command]

  variables = prepareVariables(variables, cmd)
  assertVariablesReady(variables)

  console.log(variables)
}
