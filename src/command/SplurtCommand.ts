interface SplurtCommand {
  execute(): Promise<any>
  verifyOptions(): any
}

export { SplurtCommand }