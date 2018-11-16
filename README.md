# SpLuRT

Systematic Literate Review Tool

```
Usage: splurt.ts [options]

Options:
  -V, --version         output the version number
  -q, --query <q>       Search query
  -p, --project <file>  Read config from project file
  --dblp                Search DBLP database
  --compendex           Search Compendex database
  --scopus              Search Scopus database
  --inspec              Search Inspec database
  -m, --max [n]         Maximum number of results (default: 10)
  -h, --help            output usage information
```

Project .yaml file example: 

```
query: 'blockchain'
databases: [dblp,scopus]
maximum: 10
```