export class SneedError extends Error {
  isSneedError: boolean

  constructor(msg: string) {
    super(msg)
    this.name = 'SneedError'
    this.isSneedError = true
  }
}
