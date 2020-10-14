module.exports = {
  templateFolder: 'templates',
  commands: {
    component: {
      scaffolds: [
        {
          template: 'component.ejs',
          target: 'src/components/<%= casing.pascalCase(name) %>/<%= casing.pascalCase(name) %>.tsx'
        },
        { template: 'index.ejs', target: 'src/components/<%= casing.pascalCase(name) %>/index.ts' }
      ],
      edits: [],
      variables: {
        name: {}
      }
    }
  }
}
