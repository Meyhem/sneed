import { Config } from './config'
import { FilesystemApi } from './file-system'

const defaultConfig = {
  templateFolder: 'templates',
  commands: {
    test: {
      scaffolds: [],
      edits: [],
      variables: {}
    }
  }
}

export async function initSneedEnvironment(cfg: Config | null, fs: FilesystemApi) {
  const templateFolder = cfg?.templateFolder || 'templates'

  if (!(await fs.exists(templateFolder))) {
    await fs.createDir(templateFolder)
    console.log(`+ ${templateFolder}`)
  }

  if (!cfg) {
    const p = '.sneedrc.json'
    await fs.createFile(p)
    await fs.writeFile(p, JSON.stringify(defaultConfig as Config, null, 2))
    console.log(`+ ${p}`)
  }
}
