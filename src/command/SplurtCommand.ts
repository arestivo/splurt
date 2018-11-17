abstract class SplurtCommand {
  async abstract execute() : Promise<any>
  abstract verifyOptions() : any
}

export { SplurtCommand }