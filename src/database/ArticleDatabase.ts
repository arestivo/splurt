import { Article } from '../data/Article'

import fs from 'fs'
import sqlite3 from 'sqlite3'

const createCommand = `
  CREATE TABLE article (
    id INTEGER PRIMARY KEY,

    title VARCHAR NOT NULL,
    year INTEGER NOT NULL,

    doi VARCHAR,
    authors VARCHAR,
    cites INTEGER,

    included BOOLEAN NOT NULL,
    excluded BOOLEAN NOT NULL
  )
`

export class ArticleDatabase {
  constructor(public database: string) { }

  public init(callback: () => void) {
    if (this.database && !fs.existsSync(this.database)) {
      const conn = new sqlite3.Database(this.database, err => {
        if (err) throw new Error('Failed to create database!')

        conn.run(createCommand, err2 => {
          if (err2) throw new Error('Failed to create table!')
          callback()
        })
      })
    } else callback()
  }

  public replace(articles: Article[]): void {
    if (this.database) {
      const conn = new sqlite3.Database(this.database, err => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.serialize(() => {
        conn.run('UPDATE article SET included = false AND excluded = false')

        articles.forEach(article => {
          const stmt = conn.prepare('SELECT * FROM article WHERE title = ?')
          stmt.each([article.title], (err, a) => {
            conn.run('UPDATE article SET year = ?, doi = ?, authors = ?, included = true, excluded = false WHERE title = ?',
              a.year,
              a.doi,
              a.authors,
              a.title,
            )
          }, (err, rows) => {
            if (rows === 0) {
              conn.run('INSERT INTO article VALUES (NULL, ?, ?, ?, ?, NULL, true, false)',
                article.title,
                article.year,
                article.doi,
                article.authors,
              )
            }
          })
        })
      })
    }
  }

  public fetchNeedsCite(callback: (as: Article[]) => void): Article[] {
    let articles: Article[] = []
    if (this.database) {
      const conn = new sqlite3.Database(this.database, err => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.serialize(() => {
        const stmt = conn.prepare('SELECT * FROM article WHERE included = true AND excluded = false AND cites is NULL')

        stmt.each([], (err, article) => {
          articles = articles.concat(article)
        }, () => callback(articles))
      })
    }

    return articles
  }

  public updateCites(title: string, cites?: number): void {
    if (this.database) {
      const conn = new sqlite3.Database(this.database, err => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.run('UPDATE article SET cites = ? WHERE title = ?', cites, title)
    }
  }

  public exclude(where: string, callback: (n: number) => void): void {
    if (this.database) {
      const conn = new sqlite3.Database(this.database, err => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.run(`UPDATE article SET excluded = ? WHERE included = true AND excluded = false AND (${where})`, true, function(err) {
        callback(this.changes)
      })
    }
  }
}
