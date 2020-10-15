module.exports = {
  templateFolder: 'templates',
  commands: {
    class: {
      scaffolds: [
        {
          template: 'class.ejs',
          target: 'src/generated-class.ts'
        }
      ],
      edits: [],
      variables: {
        name: {},
        properties: {}
      }
    }
  }
}
