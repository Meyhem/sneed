# Sneed

![NPM](https://img.shields.io/npm/l/sneed?style=plastic)
![npm](https://img.shields.io/npm/v/sneed)

Sneed is a simple scaffolding cli tool for developers, to generate source files based on templates they define and can keep in source control in their project.

- [Getting started](#getting-started)
- [Configuring scaffolding](#configuring-scaffolding)
- [Configuring editing](#configuring-editing)
- [Variables](#variables)
- [Templating engine](#templating-engine)
- [Path templating](#path-templating)
- [Helpers - Case transformation](#helpers---case-transformation)
- [Helpers - Paths](#helpers---paths)
- [Helpers - Lodash](#helpers---lodash)
- [Examples](#examples)

## Getting started

### Install

Install _sneed_ globally

```sh
$ npm install -g sneed
```

or locally & invoke by _npm scripts_

### Initialize environment

Sneed's _init_ command will generate required config & template folder for you

```sh
$ sneed init
```

### Define commands

Open created _.sneedrc.js_ in editor & create scaffolding/editing commands as you wish.

_See configuration section below_

### Run scaffolding

Once sneed is configured, you can execute your commands that will generate files based on your definition

```sh
$ sneed <your-command> --var1 Value1 --var2 Value2 ...
```

## Configuring scaffolding

Scaffolding is primary feature of **Sneed** that allows you to generate source code files based on your templates to your desired destination. Sneed allows configuration as _.sneedrc, .sneedrc.json, .sneedrc.js, .sneedrc.yaml_

Example _.sneedrc.js_

```js
module.exports = {
  templateFolder: 'templates',
  commands: {
    // name of command (used in cli)
    ScaffoldHelloWorldFile: {
      scaffolds: [
        {
          // your template in "templates" folder
          template: 'hello-world.ejs',
          // destination file path
          target: 'src/hello-world.js'
        }
      ],
      // not important for scaffolding
      edits: [],
      variables: {
        // cli '--greet <value>' argument will passed into template
        greet: {}
      }
    }
  }
}
```

_templates/hello-world.ejs_

```
console.log('<%= greet %>')
```

Now you can execute scaffolding your command **ScaffoldHelloWorldFile** to generate **src/hello-world.js** file

```sh
$ sneed ScaffoldHelloWorldFile --greet "Hello world"
```

which will generate

_src/hello-world.js_

```js
console.log('Hello world')
```

For more advanced examples check **examples** // TODO

## Configuring editing

File editing is secondary feature of **Sneed** and can be used to automatically modify existing source files to insert custom content.

This feature is useful for example if you want **Sneed** to automatically inject import statements of your newly generated components.

Lets have following:
_.sneedrc.js_

```js
module.exports = {
  templateFolder: 'templates',
  commands: {
    ScaffoldComponentAndRegister: {
      scaffolds: [],
      edits: [
        {
          target: 'src/register-components.js',
          mark: '// SNEED INSERT HERE',
          template: 'register-component.ejs',
          editType: 'insertAfter'
        }
      ],
      variables: {
        name: {}
      }
    }
  }
}
```

This will be rendered after our "mark"

_templates/register-component.ejs_

```js
register.component(require('./<%= name %>'))
```

This is actual source file that we edit

_src/register-components.js_

```js
register.component(require('./digging'))
register.component(require('./sewing'))
// SNEED INSERT HERE
register.component(require('./brewing'))
```

Now we execute

```sh
$ sneed ScaffoldComponentAndRegister --name building
```

and **Sneed** will insert rendered code block right after "// SNEED INSERT HERE" marking resulting in

```js
register.component(require('./digging'))
register.component(require('./sewing'))
// SNEED INSERT HERE
register.component(require('./building'))
register.component(require('./brewing'))
```

## Variables

**Sneed** provides a way how to pass custom data (e.g. component names, switches...) into rendering engine. This way you can customize how your template behaves.

Variables without "default" option are mandatory, and must be specified as CLI option.

Example _.sneedrc.js_

```js
module.exports = {
  templateFolder: 'templates',
  commands: {
    VariableTest: {
      scaffolds: [
        {
          template: 'vars.ejs',
          target: 'src/vars.txt'
        }
      ],
      edits: [],
      variables: {
        name: {},
        surname: {},
        greet: { default: false }
      }
    }
  }
}
```

_templates/vars.ejs_

```js
<% if (greet == 'true') { %>
Greetings fellow citizen,
<% } %>
you have new message <%= name %> <%= surname %>!
```

**Executing comman without --greet switch**

```sh
$ sneed VariableTest --name John --surname Wick
```

generates

```
you have new message John Wick!
```

**Executing comman with --greet switch**

```sh
$ sneed VariableTest --name John --surname Wick --greet
```

generates

```
Greetings fellow citizen,

you have new message John Wick!
```

## Templating engine

**Sneed** uses [EJS](https://github.com/mde/ejs) templating engine with all its features.

It's recommended to use **<%- value %>** tags for rendering custom values, as it doesn't escape html chars which might be in your values and would likely result in invalid source code.

_<%- %> render unescaped value (<>hello<>)_:

```js
<%- '<>hello<>' %>
```

_<%= %> render escaped value (&lt;&gt;hello&lt;&gt;)_:

```js
<%= '<>hello<>' %>
```

_<% %> are used for control flow statements_:

```js
<% if (value === 'hello') { %> Hello there <% } %>
```

_<%- include(templateFile, variables) %> for including other templates_

```js
<%- include('ClassTemplate', { class: 'Chuck' }) %>
```

(including is relative to configs "templatesFolder")

Check [EJS docs](https://github.com/mde/ejs#tags) for more!

## Path templating

**Sneed** also templates your paths in config!
Temlatable config options are **template**, **target** and **mark**

Example _.sneedrc.js_

```js
module.exports = {
  templateFolder: 'templates',
  commands: {
    TemplatedPath: {
      scaffolds: [
        {
          template: 'example-template.ejs',
          target: '<%= folder %>/example.js'
        }
      ],
      edits: [],
      variables: {
        folder: {}
      }
    }
  }
}
```

Allows you to choose denstination path by "--folder" variable

## Helpers - Case transformation

**Sneed** provides set of function from package [**change-case**](https://github.com/blakeembrey/change-case) that can be accessed in templates under **casing** property. With these functions you can easily reuse identifier names in different casing conventions across your template.

Available functions are:
**camelCase, capitalCase, constantCase, dotCase, headerCase, noCase, paramCase, pascalCase, pathCase, sentenceCase, snakeCase**

_see [**change-case**](https://github.com/blakeembrey/change-case) for more_

Example _template.ejs_

```js
class <%= casing.pascalCase(name) %> { }
var <%= casing.camelCase(name) %> = 42
```

Passing **--name hello-world** will render

```js
class HelloWorld {}
var helloWorld = 42
```

## Helpers - Paths

**Sneed** provides path helper function that can be accessed in templates under **path** property. The functions are from native [path](https://nodejs.org/api/path.html) package.

Example _template.ejs_

```js
<%= path.basename('/foo/bar/index.html') %>
```

will render

```
index.html
```

## Helpers - Lodash

**Sneed** provides utility swiss knife package [Lodash](https://lodash.com/docs) accessible under property **"\_"** which contains plethora of function for collection and object manipulation, transformation etc...

## Examples

- [Hello world](https://github.com/Meyhem/sneed/tree/master/examples/1-hello-world)
- [Variables](https://github.com/Meyhem/sneed/tree/master/examples/2-variables)
- [Class properties](https://github.com/Meyhem/sneed/tree/master/examples/3-class-properties)
- [React components](https://github.com/Meyhem/sneed/tree/master/examples/5-react-components)
