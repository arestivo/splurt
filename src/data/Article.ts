interface Article {
  origin: string;

  title: string;
  year: number;

  cites? : number
  doi?: string;
  authors?: string;
}

export { Article }