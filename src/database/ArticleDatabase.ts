import { Article } from '../data/Article'
import Color from 'colors'
import sqlite from 'sqlite'

const createCommand = `
  CREATE TABLE IF NOT EXISTS article (
    id INTEGER PRIMARY KEY,

    title VARCHAR NOT NULL,
    year INTEGER NOT NULL,

    doi VARCHAR,
    publication VARCHAR,
    authors VARCHAR,
    type varchar,
    origin varchar,

    cites INTEGER,
    abstract VARCHAR,
    link VARCHAR,
    bibtex VARCHAR,

    included BOOLEAN NOT NULL,
    excluded BOOLEAN NOT NULL,

    UNIQUE (title, year, origin)
  )
`

export class ArticleDatabase {
  private constructor(public database: string) { }

  public static async connect(database: string = ':memory:') {
    const conn = await sqlite.open(database)
    await conn.run(createCommand)
    return new ArticleDatabase(database)
  }

  public async replace(articles: Article[]) {
    if (this.database) {
      const conn = await sqlite.open(this.database)
      await conn.run('UPDATE article SET included = false AND excluded = false')

      await conn.run('BEGIN TRANSACTION')
      articles.forEach(async article => {
        const stmt = await conn.prepare('SELECT * FROM article WHERE title = ? AND year = ? AND origin = ?')
        const existing = await stmt.get(article.title, article.year, article.origin)

        if (existing)
          await conn.run('UPDATE article SET doi = ?, publication = ?, authors = ?, type = ?, included = true, excluded = false WHERE title = ? AND year = ? AND origin = ?',
            article.doi,
            article.publication,
            article.authors,
            article.type,

            article.title,
            article.year,
            article.origin
          )
        else
          try {
            await conn.run('INSERT INTO article VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, true, false)',
              article.title,
              article.year,
              article.doi,
              article.publication,
              article.authors,
              article.type,
              article.origin
            )
          } catch (e) {
            console.log(Color.red(e))
            console.log(article)
          }
      })
      await conn.run('END TRANSACTION')
    }
  }

  public async fetchNeedsData() {
    let articles: Article[] = []

    if (this.database) {
      const conn = await sqlite.open(this.database)
      const stmt = await conn.prepare('SELECT * FROM article WHERE included = true AND excluded = false AND (cites is NULL OR abstract is NULL)')
      await stmt.each((_, article) => articles = articles.concat(article))
    }

    return articles
  }

  public async updateData(article: Article) {
    if (this.database) {
      const conn = await sqlite.open(this.database)
      await conn.run('UPDATE article SET cites = ?, abstract = ?, link = ?, bibtex = ? WHERE title = ? AND year = ? AND origin = ?',
        article.cites, article.abstract, article.link, article.bibtex, article.title, article.year, article.origin)
    }
  }

  public async exclude(where: string) {
    if (this.database) {
      const conn = await sqlite.open(this.database)
      const update = await conn.run(`UPDATE article SET excluded = ? WHERE included = true AND excluded = false AND (${where})`, true)
      return update.changes
    }
  }

  public async getSelectedArticles(data? : string[]): Promise<any> {
    if (this.database) {
      const columns = data ? data.join(', ') : 'id, doi, title, year, authors, publication, type, origin, cites, abstract, link, bibtex'
      const conn = await sqlite.open(this.database)
      const stmt = await conn.prepare(`SELECT ${columns} FROM article WHERE included AND NOT excluded`)
      const articles = await stmt.all()
      return articles
    }
  }
}
