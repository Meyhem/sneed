import { Config } from './config'
import { FilesystemApi } from './file-system'

const defaultConfig = `
module.exports = {
  templateFolder: 'templates',
  commands: {
    ScaffoldHelloWorldFile: {
      scaffolds: [
        {
          template: 'hello-world.ejs',
          target: 'src/hello-world.js'
        }
      ],
      edits: [],
      variables: {
        greet: {}
      }
    }
  }
}
`

export async function initSneedEnvironment(cfg: Config | null, fs: FilesystemApi) {
  const templateFolder = cfg?.templateFolder || 'templates'

  if (!(await fs.exists(templateFolder))) {
    await fs.createDir(templateFolder)
    console.log(`+ ${templateFolder}`)
  }

  if (!cfg) {
    const p = '.sneedrc.js'
    await fs.createFile(p)
    await fs.writeFile(p, defaultConfig)
    console.log(`+ ${p}`)
  }
}
