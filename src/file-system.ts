import { constants, promises as fs } from 'fs'

export type FilesystemApi = typeof filesystem

export const filesystem = {
  readFile: async (path: string) => await fs.readFile(path, { encoding: 'utf8' }),
  writeFile: async (path: string, contents: string) => await fs.writeFile(path, contents),
  createFile: async (path: string) => await fs.open(path, constants.O_CREAT | constants.O_TRUNC),
  createDir: async (path: string) => await fs.mkdir(path, { recursive: true }),
  canRead: async (path: string) => {
    try {
      await fs.access(path, constants.R_OK)
      return true
    } catch {
      return false
    }
  },
  exists: async (path: string) => {
    try {
      await fs.access(path, constants.F_OK)
      return true
    } catch {
      return false
    }
  }
}
