export const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      article .authors {
        color: #2323c7;
      }
      article .publication {
        font-size: 0.9em;
        color: #666;
      }
      article .abstract {
        margin: 1em 0;
        color: #444;
        max-height: 20.5em; overflow: hidden;
        transition: max-height 2s;
      }
      article footer {
        font-size: 0.9em;
        color: #2323c7;
      }
      </style>
      <script>
        function toggle(e) {
          e.style.maxHeight = e.style.maxHeight == '100em' ? '20.5em' : '100em'
          e.style.overflow = 'hidden'
        }
      </script>
      <script>
        function copyText(target) {
          var el = document.getElementById(target);
          var textArea = document.createElement("textarea");
          textArea.value = el.textContent;
          document.body.appendChild(textArea);
          textArea.select();
          textArea.setSelectionRange(0, 99999)
          document.execCommand("Copy");
          textArea.remove();
        }
      </script>
  </head>
  <body>
    <header>
      <h1>SpLuRT</h1>
      <h2>A Systematic Literary Review Tool</h2>
    </header>
    <main>
      {{#articles_sanitized}}
        <article>
          <header>
            <h3><a href="{{link}}">{{title}}</a></h3>
            <div class="authors">{{authors}}</div>
            <div class="publication">{{publication}}</div>
          </header>
          <p class="abstract" onclick="toggle(event.target)">{{abstract}}</span>
          <footer>
            <span class="type">{{Type}}</span>
            {{#cites}}<span class="cites">Cited by <span class="number">{{cites}}</span>{{/cites}}
            <br>
            <span>DOI: <span id="paper_{{id}}">{{doi}}</span></span>
            <button onclick="copyText('paper_{{id}}')">copy</button>
            <br>
            <a href="export/{{sanitized}}.pdf">Local pdf</a>
          </footer>
        </article>
      {{/articles_sanitized}}
    </main>
  </body>
</html>`
