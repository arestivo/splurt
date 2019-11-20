# SpLuRT

Systematic Literate Review Tool

## Install

Globally:

```
sudo npm install -g --unsafe-perm splurt
```

Locally:

```
npm run-script build 
npm link
```

which will make the binaries available through a series of links, such as:

```
/usr/local/bin/splurt -> /usr/local/lib/node_modules/splurt/build/src/bin/splurt.js
/usr/local/bin/splurt-fetch -> /usr/local/lib/node_modules/splurt/build/src/bin/splurt-fetch.js
/usr/local/bin/splurt-exclude -> /usr/local/lib/node_modules/splurt/build/src/bin/splurt-exclude.js
/usr/local/bin/splurt-citations -> /usr/local/lib/node_modules/splurt/build/src/bin/splurt-citations.js
/usr/local/bin/splurt-export -> /usr/local/lib/node_modules/splurt/build/src/bin/splurt-export.js
/usr/local/lib/node_modules/splurt -> <DEV_DIR>
```

Please be aware that you might need to prefix some of these commands with `sudo`. However, this is a security red-flag, and there's no reason (with the appropriate shell configuration) to leave user-land mode.

## Fetch

```
Options:
  -V, --version            output the version number
  -p, --project <file>     Read config from project YAML file.
  -q, --query <q>          Search query (default: "")
  -d, --databases <list>   Comma separated list of databases to search. (default: [])
  -m, --max [n]            Maximum number of results. (default: 10)
  --scopus <key>           Scopus API key.
  --title                  Title only search (scopus).
  -s, --sqlite <database>  SQLite database used to store articles.
  -h, --help               output usage information
```

## Data

```
Usage: splurt data|d [options]

Options:
  -V, --version            output the version number
  -p, --project <file>     Read config from project YAML file.
  -d, --delay <s>          Delay between requests. (default: 10)
  -c, --cookie <c>         Cookie to add to header.
  -s, --sqlite <database>  SQLite database used to store articles.
  -h, --help               output usage information
```

## Exclude

```
Usage: splurt exclude|e [options]

Options:
  -V, --version             output the version number
  -p, --project <file>      Read config from project YAML file.
  -e, --exclude <criteria>  Comma separated exclusion criteria using SQL.
  -s, --sqlite <database>   SQLite database used to store articles.
  -h, --help                output usage information

```

## Export

```
Usage: splurt export|x [options]

Options:
  -V, --version            output the version number
  -p, --project <file>     Read config from project YAML file.
  -f, --format <format>    Export format. (default: "csv")
  -d, --data <list>        Data columns to export (id, title, authors, year, publication, doi.
  -s, --sqlite <database>  SQLite database used to store articles.
  -h, --help               output usage information
```

## Examples

```
splurt fetch -s articles.db -q 'blockchain AND cloud' -d 'dblp,scopus' -m 20
```

```
splurt exclude -s articles.db -e 'year < 2000, year < 2016 AND cites = 0'
```

```
splurt data -s articles.db -c 'COOKIE=value'
```

```
splurt export -s articles.db -d 'title,year,cites' -f table
```

## Project

Requires:
1. `SCOPUS_API_KEY` that can be obtained by going [here](https://dev.elsevier.com/) and following the "Get API Key" instructions.
2. `cookie` from [google scholar](https://scholar.google.com/):
   1. browse to incognito window
   2. open available cookies and copy the value from the `GSP` cookie
   3. paste it like `cookie: "LM=12345678:S=example"`

Project ```project.yaml``` file example:

```yaml
sqlite: articles.db

fetch:
  query: 'blockchain AND cloud'
  databases: [dblp,scopus]
  maximum: 20
  scopus: SCOPUS_API_KEY

exclude:
  # SQL like WHERE using these columns: id, doi, title, year, authors, publication, 
  # type, origin, cites, abstract, link, bibtex
  criteria: ['cites = 0 OR cites IS NULL','year < 2000']

data:
  delay: 2
  cookie: 'COOKIE=value'

export:
  # id, doi, title, year, authors, publication, 
  # type, origin, cites, abstract, link, bibtex
  data: [title, year, cites]
  # if the format is html, the data attribute is ignored
  format: table # can be csv,json,table,html
```

Using projects:

```
splurt fetch -p project.yaml -s articles.db
splurt data -p project.yaml -s articles.db
splurt exclude -p project.yaml -s articles.db
splurt export -p project.yaml -s articles.db
```
