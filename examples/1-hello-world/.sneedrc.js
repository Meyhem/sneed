module.exports = {
  templateFolder: 'templates',
  commands: {
    hello: {
      scaffolds: [{ template: 'hello.ejs', target: 'scaffolded-hello-world.txt' }],
      edits: [],
      variables: {}
    }
  }
}
