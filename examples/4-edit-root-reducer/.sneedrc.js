module.exports = {
  templateFolder: 'templates',
  commands: {
    reducer: {
      scaffolds: [
        {
          template: 'reducer.ejs',
          target: "redux/<%- casing.camelCase(feature + 'Reducer') %>.js"
        }
      ],
      edits: [
        {
          template: 'import.ejs',
          mark: '// SNEED INSERT IMPORT',
          target: 'redux/rootReducer.js',
          editType: 'insertAfter'
        },
        {
          template: 'combine.ejs',
          mark: '// SNEED INSERT REDUCER',
          target: 'redux/rootReducer.js',
          editType: 'insertAfter'
        }
      ],
      variables: {
        feature: {}
      }
    }
  }
}
