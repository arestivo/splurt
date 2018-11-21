import { Article } from '../data/Article'

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

    included BOOLEAN NOT NULL,
    excluded BOOLEAN NOT NULL
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

      //TODO: get cites from database so we don't lose that information

      articles.forEach(async article => {
        await conn.run('INSERT INTO article VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, NULL, true, false)',
          article.title,
          article.year,
          article.doi,
          article.publication,
          article.authors,
          article.type,
          article.origin
        )
      })
    }
  }

  public async fetchNeedsCite() {
    let articles: Article[] = []

    if (this.database) {
      const conn = await sqlite.open(this.database)
      const stmt = await conn.prepare('SELECT * FROM article WHERE included = true AND excluded = false AND cites is NULL')
      await stmt.each((_, article) => articles = articles.concat(article))
    }

    return articles
  }

  public async updateCites(title: string, cites?: number) {
    if (this.database) {
      const conn = await sqlite.open(this.database)
      await conn.run('UPDATE article SET cites = ? WHERE title = ?', cites, title)
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
      const columns = data ? data.join(', ') : 'id, title, year, authors, publication, doi, cites'
      const conn = await sqlite.open(this.database)
      const stmt = await conn.prepare(`SELECT ${columns} FROM article WHERE included AND NOT excluded`)
      const articles = await stmt.all()
      return articles
    }
  }
}
