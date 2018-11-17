# SpLuRT

Systematic Literate Review Tool

## Install

```
npm install splurt -g
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
splurt complete -s articles.db -c 'COOKIE'
```

## Project

Project ```project.yaml``` file example: 

```
query: 'blockchain AND cloud'
databases: [dblp,scopus]
maximum: 20
```

Using projects:

```
splurt fetch -p project.yaml -s articles.db
```
