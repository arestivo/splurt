# SpLuRT

Systematic Literate Review Tool

## Install

```
sudo npm install -g --unsafe-perm splurt
```

or locally:

```
sudo npm install splurt
```

but then, executable will be in

```
<INSTALL_DIR>/node_modules/.bin/splurt
```

## Fetch

```
Usage: splurt fetch|f [options]

Options:
  -V, --version            output the version number
  -p, --project <file>     Read config from project YAML file.
  -q, --query <q>          Search query
  -d, --databases <list>   Comma separated list of databases to search.
  -m, --max [n]            Maximum number of results. (default: 10)
  -s, --sqlite <database>  SQLite database used to store articles.
  --verbose <database>     Verbose output.
  -h, --help               output usage information
```

## Complete (cite count)

```
Usage: splurt complete|c [options]

Options:
  -V, --version            output the version number
  -p, --project <file>     Read config from project YAML file.
  -d, --delay <s>          Delay between requests. (default: 2)
  -c, --cookie <c>         Cookie to add to header.
  -s, --sqlite <database>  SQLite database used to store articles.
  -h, --help               output usage information
```

## Examples

```
splurt fetch -q 'blockchain AND cloud' -d 'dblp,scopus' -m 20 -s articles.db
```

```
splurt complete -s articles.db -c 'COOKIE=value'
```

## Project

Project ```project.yaml``` file example: 

```
fetch:
  query: 'blockchain AND cloud'
  databases: [dblp,scopus]
  maximum: 20

complete:
  delay: 2
  cookie: 'COOKIE=value'
```

Using projects:

```
splurt fetch -p project.yaml -s articles.db
splurt complete -p project.yaml -s articles.db
```
