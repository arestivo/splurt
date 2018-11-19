export interface SplurtCommand<T> {
  execute(): Promise<T>
  verifyOptions(): any
}
