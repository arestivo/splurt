# SpLuRT

Systematic Literate Review Tool

```
Usage: splurt [options]

Options:
  -V, --version           output the version number
  -q, --query <q>         Search query
  -d, --databases <list>  Comma separated list of databases to search.
  -m, --max [n]           Maximum number of results. (default: 10)
  -p, --project <file>    Read config from project YAML file.
  -h, --help              output usage information
```

Example:

```
splurt -q 'blockchain AND cloud' -d 'dblp,scopus' -m 20
```

Project .yaml file example: 

```
query: 'blockchain'
databases: [dblp,scopus]
maximum: 10
```