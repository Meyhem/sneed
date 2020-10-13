# Sneed

Sneed is a simple scaffolding cli tool for developers, to generate source files based on templates they define and can keep in source control in their project.

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

File editing is secondary feature of **Sneed** and can be used to automatically modify existing source files to insert custom content. This feature is useful for example if you want **Sneed** to automatically inject import statements of your newly generated files.

// TODO
