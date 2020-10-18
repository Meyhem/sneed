module.exports = {
  templateFolder: 'templates',
  commands: {
    service: {
      scaffolds: [
        {
          template: 'interface.ejs',
          target: '<%- folder %>/I<%- casing.pascalCase(name) %>Service.cs'
        },
        {
          template: 'service.ejs',
          target: '<%- folder %>/<%- casing.pascalCase(name) %>Service.cs'
        }
      ],
      edits: [],
      variables: {
        name: {},
        folder: { default: 'src/Core/Services' },
        namespace: { default: 'ProjectName.Core.Services' }
      }
    }
  }
}
