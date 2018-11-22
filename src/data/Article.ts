export interface Article {
  origin: string

  title: string
  year: number

  doi?: string
  publication?: string
  authors?: string
  type?: string

  cites?: number
  abstract?: string
  link?: string
  bibtex?: string
}
