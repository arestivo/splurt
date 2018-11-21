export interface Article {
  origin: string

  title: string
  year: number

  doi?: string
  publication?: string
  authors?: string
  cites?: number
  type?: string
}
