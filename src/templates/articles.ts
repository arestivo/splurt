export const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      html {
        background-color: #EEE;
      }
      body {
        max-width: 40em;
        margin: 0 auto; padding: 1em;
        background-color: #FFF;
        font-family: Palatino;
      }
      a {
        color: #c72323;
        text-decoration: none;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: Arial;
      }
      article h3 {
        margin-bottom: 0.2em;
      }
      article header div {
        font-size: 0.9em;
        color: #2323c7;
      }
      article .abstract {
        margin: 1em 2em;
        color: #444;
      }
      article footer {
        font-size: 0.9em;
        color: #2323c7;
      }
      </style>
  </head>
  <body>
    {{#articles}}
    <article>
      <header>
        <h3><a href="{{link}}">{{title}}</a></h3>
        <div>
        <span class="authors">{{authors}}</span> : <span class="publication">{{publication}}</span>
        </div>
      </header>
      <p class="abstract">{{abstract}}</span>
      <footer>
        <span class="type">{{Type}}</span>
        {{#cites}}<span>Cited by {{cites}}</span>{{/cites}}
      </footer>
    </article>
    {{/articles}}
  </body>
</html>`
