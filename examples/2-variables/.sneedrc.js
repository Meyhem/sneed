module.exports = {
  templateFolder: 'templates',
  commands: {
    greet: {
      scaffolds: [
        {
          template: 'greeting.ejs',
          target: 'greeting.txt'
        }
      ],
      edits: [],
      variables: {
        name: {},
        surname: {}
      }
    }
  }
}
