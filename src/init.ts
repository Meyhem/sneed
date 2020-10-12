import { Config } from './config'
import { FilesystemApi } from './file-system'

export async function initSneedEnvironment(cfg: Config | null, fs: FilesystemApi) {
  const templateFolder = cfg?.templateFolder || 'templates'

  if (!(await fs.exists(templateFolder))) {
    await fs.createDir(templateFolder)
    console.log(`+ ${templateFolder}`)
  }

  if (!cfg) {
    const p = '.sneedrc.json'
    await fs.createFile(p)
    await fs.writeFile(p, JSON.stringify({ templateFolder: 'templates', commands: {} } as Config, null, 2))
    console.log(`+ ${p}`)
  }
}
