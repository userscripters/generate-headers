```
Options:
      --version             Show version number                        [boolean]
      --help                Show help                                  [boolean]
  -c, --collapse            When using `match all <template>` option value, coll
                            apses all *.stackexchange.com sites into one wildcar
                            d match                    [boolean] [default: true]
  -d, --direct              Directs headers content to `process.stdout`
                                                      [boolean] [default: false]
      --du, --download-url  URL for the @downloadURL header             [string]
  -e, --eol                 Sets the end-of-line character(s) (affects the check
                             for existing headers)          [string] [default: "
                                                                              "]
  -h, --homepage            Overrides homepage for @homepage header     [string]
  -i, --inject              Adds @inject-into header for Violentmonkey, no-op ot
                            herwise                                     [string]
  -g, --grant               Generates @grant headers, can be repeated    [array]
  -m, --match               Generates valid @match headers (repeatable)  [array]
  -n, --namespace           Overrides namespace for @namespace header   [string]
  -o, --output              Creates and populates a file with headers content
                                         [string] [default: "./dist/headers.js"]
  -p, --package             Path to package.json to extract info from
                                            [string] [default: "./package.json"]
  -q, --require             Generates valid @require headers (repeatable)[array]
  -r, --run                 Adds @run-at header (values missing in manager are s
                            ilently dropped)         [string] [default: "start"]
  -s, --spaces              Number of spaces to indent header values with (total
                             is the longest name + this value)
                                                           [number] [default: 4]
  -u, --update-url          URL for the @updateURL header for Tampermonkey, no-o
                            p otherwise                                 [string]
  -w, --whitelist           Generates @connect headers (repeatable)      [array]
  -x, --exclude             Generates @exclude[-match] headers (repeatable)
                                                                         [array]
      --pretty              Prettifies outputted headers where possible
                                                      [boolean] [default: false]
```
