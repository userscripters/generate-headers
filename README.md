
# About

| Author       | Oleg Valter<br>[oleg.a.valter@gmail.com](mailto:oleg.a.valter@gmail.com) |
| :----------- | :----------------------- |
| Contributors | double beep<br>[https://github.com/double-beep](https://github.com/double-beep) |
| Name | @userscripters/generate-headers |
| Description | Userscript manager header generator |
| License | [GPL-3.0-or-later](https://spdx.org/licenses/GPL-3.0-or-later) |
| Version | 3.3.0 |

Installation instructions and usage examples can be found on the [Stack Apps post](https://stackapps.com/q/9088/78873).

### CLI usage

```shell
generate-headers <greasemonkey|tampermonkey|violentmonkey>
```

```
Options:
      --version              Show version number                       [boolean]
      --help                 Show help                                 [boolean]
  -c, --collapse             When using `match all <template>` option value, col
                             lapses all *.stackexchange.com sites into one wildc
                             ard match                 [boolean] [default: true]
      --ch, --custom-header  Generates custom headers given a <name> and [value]
                                                                        [string]
  -d, --direct               Directs headers content to `process.stdout`
                                                      [boolean] [default: false]
      --du, --download-url   URL for the @downloadURL header            [string]
  -e, --eol                  Sets the end-of-line character(s) (affects the chec
                             k for existing headers)        [string] [default: "
                                                                              "]
  -h, --homepage             Overrides homepage for @homepage header    [string]
  -i, --inject               Adds @inject-into header for Violentmonkey, no-op o
                             therwise                                   [string]
  -g, --grant                Generates @grant headers, can be repeated   [array]
  -m, --match                Generates valid @match headers (repeatable) [array]
  -n, --namespace            Overrides namespace for @namespace header  [string]
      --nf, --noframes       Adds @noframes header                     [boolean]
  -o, --output               Creates and populates a file with headers content
                                         [string] [default: "./dist/headers.js"]
  -p, --package              Path to package.json to extract info from
                                            [string] [default: "./package.json"]
  -q, --require              Generates valid @require headers (repeatable)
                                                                         [array]
  -r, --run                  Adds @run-at header (values missing in manager are
                             silently dropped)       [string] [default: "start"]
  -s, --spaces               Number of spaces to indent header values with (tota
                             l is the longest name + this value)
                                                           [number] [default: 4]
  -u, --update-url           URL for the @updateURL header for Tampermonkey, no-
                             op otherwise                               [string]
  -w, --whitelist            Generates @connect headers (repeatable)     [array]
  -x, --exclude              Generates @exclude[-match] headers (repeatable)
                                                                         [array]
      --pretty               Prettifies outputted headers where possible
                                                      [boolean] [default: false]
```

# Support

Bug reports for the project should be [submitted here](https://github.com/userscripters/generate-headers/issues).
<br>Before adding a new one, please check if it hasn't been raised before.
  