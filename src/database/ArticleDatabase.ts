import { Article } from "../data/Article";

import Color from 'colors'

import sqlite3, { Database } from 'sqlite3'
import fs from 'fs' 

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

class ArticleDatabase {
  database : string | undefined = undefined

  constructor(database : string) {
    this.database = database
  }

  init(callback : Function) {
    if (this.database && !fs.existsSync(this.database)) {
      const conn : Database = new sqlite3.Database(this.database, (err) => {
        if (err) throw new Error('Failed to create database!')

        conn.run(createCommand, (err) => {
          if (err) throw new Error('Failed to create table!')
          callback()
        }) 
      })
    }
  }

  replace(articles: Article[]): void {
    if (this.database) {
      const conn = new sqlite3.Database(this.database, (err) => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.serialize(function(){
        conn.run('UPDATE article SET included = false AND excluded = false');

        articles.forEach(article => {
          const stmt = conn.prepare('SELECT * FROM article WHERE title = ?')
          stmt.each([article.title], function(err, article) {
            conn.run('UPDATE article SET year = ?, doi = ?, authors = ?, included = true, excluded = false WHERE title = ?', 
              article.year,
              article.doi,
              article.authors,
              article.title
            ) 
          }, function(err, rows) {
            if (rows == 0) {
              conn.run('INSERT INTO article VALUES (NULL, ?, ?, ?, ?, NULL, true, false)', 
                article.title,
                article.year,
                article.doi,
                article.authors
              ) 
            }
          })
        })
      })
    }
  }

  fetchNeedsCite(callback : Function): Article[] {
    let articles : Article [] = []
    if (this.database) {
      const conn = new sqlite3.Database(this.database, (err) => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.serialize(function(){
        const stmt = conn.prepare('SELECT * FROM article WHERE included = true AND excluded = false AND cites is NULL')

        stmt.each([], function(err, article) {
          articles = articles.concat(article)
        }, function() {
          callback(articles)
        })
      })
    }

    return articles
  }

  updateCites(title: string, cites: number | undefined): void {
    if (this.database) {
      const conn = new sqlite3.Database(this.database, (err) => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.run('UPDATE article SET cites = ? WHERE title = ?', cites, title)
    }
  }

  exclude(where: string, callback: Function): void {
    if (this.database) {
      const conn = new sqlite3.Database(this.database, (err) => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.run('UPDATE article SET excluded = ? WHERE included = true AND excluded = false AND (' + where + ')', true, function(err) {
        callback(this.changes)
      })
    }
  }

}

export { ArticleDatabase }