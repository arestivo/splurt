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
        color: #c72323;
        font-family: Arial;
      }
      article {
        background-color: #EEE;
        padding: 1em; margin: 1em;
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
      article .abstract {
        max-height: 20.5em; overflow: hidden;
        transition: max-height 2s;
      }
      </style>
      <script>
        function toggle(e) {
          e.style.maxHeight = e.style.maxHeight == '100em' ? '20.5em' : '100em'
          e.style.overflow = 'hidden'
        }
      </script>
  </head>
  <body>
    <header>
      <h1>SpLuRT</h1>
      <h2>A Systematic Literary Review Tool</h2>
    </header>
    <main>
      {{#articles}}
        <article>
          <header>
            <h3><a href="{{link}}">{{title}}</a></h3>
            <div>
            <span class="authors">{{authors}}</span> : <span class="publication">{{publication}}</span>
            </div>
          </header>
          <p class="abstract" onclick="toggle(event.target)">{{abstract}}</span>
          <footer>
            <span class="type">{{Type}}</span>
            {{#cites}}<span class="cites">Cited by {{/cites}}<span class="number">{{cites}}</span>
          </footer>
        </article>
      {{/articles}}
    </main>
  </body>
</html>`
