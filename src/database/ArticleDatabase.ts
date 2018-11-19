import { Article } from '../data/Article'

import fs from 'fs'
import sqlite from 'sqlite'

const createCommand = `
  CREATE TABLE IF NOT EXISTS article (
    id INTEGER PRIMARY KEY,

    title VARCHAR NOT NULL,
    year INTEGER NOT NULL,

    doi VARCHAR,
    publication VARCHAR,
    authors VARCHAR,
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

      articles.forEach(async article => {
        await conn.run('INSERT OR REPLACE INTO article VALUES (NULL, ?, ?, ?, ?, ?, NULL, true, false)',
          article.title,
          article.year,
          article.doi,
          article.publication,
          article.authors,
        )
      })
    }
  }

  public async fetchNeedsCite() {
    let articles: Article[] = []

    if (this.database) {
      const conn = await sqlite.open(this.database)
      const stmt = await conn.prepare('SELECT * FROM article WHERE included = true AND excluded = false AND cites is NULL')
      stmt.each((_, article) => articles = articles.concat(article))
    }

    return articles
  }

  public async updateCites(title: string, cites?: number) {
    if (this.database) {
      const conn = await sqlite.open(this.database)
      conn.run('UPDATE article SET cites = ? WHERE title = ?', cites, title)
    }
  }

  public async exclude(where: string) {
    if (this.database) {
      const conn = await sqlite.open(this.database)
      const update = await conn.run(`UPDATE article SET excluded = ? WHERE included = true AND excluded = false AND (${where})`, true)
      return update.changes
    }
  }
}
