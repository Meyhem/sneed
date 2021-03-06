import { cosmiconfig } from 'cosmiconfig'
import _ from 'lodash'
import { Schema, Validator } from 'jsonschema'

import { Dictionary } from './types'
import { SneedError } from './errors'

export interface Command {
  scaffolds: Array<{ template: string; target: string }>
  edits: Array<{ target: string; mark: string; template: string; editType: 'insertBefore' | 'insertAfter' | 'replace' }>
  variables: Dictionary<{ default?: string | number | null }>
}

export interface Config {
  templateFolder: string
  commands: Dictionary<Command>

  override?: boolean
}

const configSchema: Schema = {
  id: '/root',
  type: 'object',
  additionalProperties: false,
  properties: {
    templateFolder: { type: 'string', required: true },
    commands: {
      type: 'object',
      required: true,
      additionalProperties: {
        type: 'object',
        additionalProperties: false,
        properties: {
          scaffolds: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                template: { type: 'string', required: true },
                target: { type: 'string', required: true }
              }
            }
          },
          edits: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                template: { type: ['string'], required: true },
                target: { type: 'string', required: true },
                mark: { type: 'string', required: true },
                editType: { type: 'string', required: true, enum: ['insertBefore', 'insertAfter', 'replace'] }
              }
            }
          },
          variables: {
            type: 'object',
            required: true,
            additionalProperties: {
              type: 'object',
              additionalProperties: false,
              properties: {
                default: { type: ['string', 'number', 'boolean', 'null'] }
              }
            }
          }
        }
      }
    }
  }
}

export async function loadConfig(): Promise<Config> {
  const result = await cosmiconfig('sneed', { stopDir: process.cwd() }).search()

  if (!result || result.isEmpty) {
    throw new SneedError('No config found. Try adding .sneedrc, .sneedrc.json, .sneed.yaml, .sneedrc.js...')
  }

  const cfg = result?.config as Config
  const validator = new Validator()
  const validationResult = validator.validate(cfg, configSchema)

  if (!validationResult.valid) {
    throw new SneedError(`Invalid configuration: ${_.join(validationResult.errors)}`)
  }

  return cfg
}
