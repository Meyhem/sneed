import { assertVariablesReady, executeTemplateString, prepareVariables } from '../templating'

describe('prepareVariables', () => {
  test('maps default values', () => {
    const out = prepareVariables({}, { scaffolds: [], edits: [], variables: { chucks: { default: 'Feed & Seed' } } })
    expect(out.chucks).toEqual('Feed & Seed')
  })

  test('adds helper functions to variables', () => {
    const out = prepareVariables({}, { scaffolds: [], edits: [], variables: {} })
    expect(out.path).not.toBeUndefined()
    expect(out.casing).not.toBeUndefined()
  })
})

describe('assertVariablesReady', () => {
  test('passes prepared variables', () => {
    expect(() => assertVariablesReady({ chuck: 'Feed & Seed' })).not.toThrow()
  })

  test('fals un-prepared variables', () => {
    expect(() => assertVariablesReady({ chuck: undefined as any })).toThrow()
  })
})

describe('executeTemplateString', () => {
  test('renders const string', () => {
    const out = executeTemplateString('Feed & Seed', {}, '')
    expect(out).toEqual('Feed & Seed')
  })

  test('renders with variable', () => {
    const out = executeTemplateString('<%- name %> Feed & Seed', { name: "Chuck's" }, '')
    expect(out).toEqual("Chuck's Feed & Seed")
  })

  test('evaluates condition', () => {
    const out = executeTemplateString('<% if (true) { %>Feed & Seed<% } %>', {}, '')
    expect(out).toEqual('Feed & Seed')
  })
})
