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

    fetched BOOLEAN NOT NULL,
    filtered BOOLEAN NOT NULL
  )
`

class ArticleDatabase {
  database : string | undefined = undefined

  constructor(database : string) {
    this.database = database

    sqlite3.verbose()

    if (!fs.existsSync(database)) {
      const conn : Database = new sqlite3.Database(database, (err) => {
        if (err) throw new Error('Failed to create database!')

        conn.run(createCommand, (err) => {
          if (err) throw new Error('Failed to create table!')
        }) 

        conn.close()
      })
    }        
  }

  replace(articles: Article[]): void {
    if (this.database) {
      const conn = new sqlite3.Database(this.database, (err) => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.serialize(function(){
        conn.run('UPDATE article SET fetched = false AND filtered = false');

        articles.forEach(article => {
          const stmt = conn.prepare('SELECT * FROM article WHERE title = ?')
          stmt.each([article.title], function(err, article) {
            conn.run('UPDATE article SET year = ?, doi = ?, authors = ?, fetched = true, filtered = true WHERE title = ?', 
              article.year,
              article.doi,
              article.authors,
              article.title
            ) 
          }, function(err, rows) {
            if (rows == 0) {
              conn.run('INSERT INTO article VALUES (NULL, ?, ?, ?, ?, NULL, true, true)', 
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
        const stmt = conn.prepare('SELECT * FROM article WHERE fetched = true AND filtered = true AND cites is NULL')

        stmt.each([], function(err, article) {
          articles = articles.concat(article)
        }, function() {
          callback(articles)
        })
      })
    }

    return articles
  }

  updateCites(title: string, cites: number | undefined): any {
    if (this.database) {
      const conn = new sqlite3.Database(this.database, (err) => {
        if (err) throw new Error('Failed to open database!')
      })

      conn.run('UPDATE article SET cites = ? WHERE title = ?', cites, title)
    }
  }

}

export { ArticleDatabase }