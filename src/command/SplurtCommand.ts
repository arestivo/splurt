export interface SplurtCommand {
  execute(): Promise<any>
  verifyOptions(): any
}
