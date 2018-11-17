import {Article} from '../data/Article'
import {ArticleScraper} from './ArticleScraper'

class DBLPArticleScraper extends ArticleScraper {
  uri : string = 'http://dblp.org/search/publ/api'

  async query(q : string, maximum : number = 10): Promise<Article[]> {
    let current : number = 0
    let articles : Article[] = []

    while (!maximum || current < maximum) {
      const newArticles : Article[] = await this.queryPage(q, current)
      if (newArticles.length == 0) break
      articles = articles.concat(newArticles)
      current += newArticles.length
    }

    return articles.slice(0, maximum)
  }

  async queryPage(q : string, f : number) : Promise<Article[]> {
    const json = await this.get(this.uri, {q, f, format : 'json'})
    const elements : any[] = json.data.result.hits.hit
    return elements ? elements.map(e => e.info).map(
      (i : any) => ({
        origin: 'dblp',
        title: i.title,
        year: i.year,
        doi: i.doi,
        authors: i.authors ? (
            Array.isArray(i.authors.author) ? 
            i.authors.author.join(', ') : 
            i.authors.author ) : undefined // Undefined author
      })
    ) : [] // No articles
  }
}

export {DBLPArticleScraper}