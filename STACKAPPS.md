<!-- thumbnail: https://i.stack.imgur.com/Z1HJy.png -->
<!-- version: 3.4.0 -->
<!-- tag: library -->
<!-- excerpt: Tired of writing out userscript headers by hand? Of small typos in your @match headers leading to wasted time? Generate Headers to the rescue: this utility package automates header generation for popular userscript managers like Tampermonkey, Violentmonkey, and Greasemonkey  -->

### About

Tired of writing out userscript headers by hand? Of small typos in your @match headers leading to wasted time? Generate Headers to the rescue: this utility package automates header generation for popular userscript managers like Tampermonkey, Violentmonkey, and Greasemonkey.

Most of the information is sourced from your package.json file (on an off-chance you are unfamiliar, here are [the NPM docs][1]), and some headers you provide explicitly to either the CLI interface or the programmatic API (like `@grant` or `@match`).

### Usage example

CLI usage:

```shell
generate-headers tampermonkey \
    -m "https://*.stackexchange.com/*" \
    -o "dist/headers.txt" \
    -g get set delete fetch \
    -p "./package.json" \
    -w tampermonkey.net
```

Programmatic usage as a module:

```javascript
import { generate } from "@userscripters/generate-headers/dist/generate";

const content = await generate("greasemonkey", {
    direct: true,
    eol: "\n",
    grants: ["get", "set", "delete", "fetch"],
    matches: ["https://*.stackexchange.com/*"],
    packagePath: "./package.json",
    whitelist: ["self", "1.2.3.4", "google.com"],
});
```

Example output:

```javascript
// ==UserScript==
// @name            bring-back-404
// @author          Oleg Valter <oleg.a.valter@gmail.com>
// @connect         self
// @description     Brings back 404 pages to Stack Exchange network
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @homepage        https://github.com/userscripters/bring-back-404#readme
// @match           https://*.askubuntu.com/*
// @match           https://*.mathoverflow.net/*
// @match           https://*.serverfault.com/*
// @match           https://*.stackapps.com/*
// @match           https://*.stackexchange.com/*
// @match           https://*.stackoverflow.com/*
// @namespace       userscripters
// @source          git+https://github.com/userscripters/bring-back-404.git
// @supportURL      https://github.com/userscripters/bring-back-404/issues
// @version         0.9.0
// ==/UserScript==
```

### License

The script is licensed under the [GPL-3.0-or-later][2] license.

### Download

The package is published as both an [NPM package][3] and a [GitHub package][4]. Can be installed via a package manager like NPM as usual:

```shell
npm install --save-dev @userscripters/generate-headers
```

If you opt to install it from the GitHub registry, please note that it only supports scoped packages, you will need a simple .npmrc file at your project root:

```npmrc
@userscripters:registry=https://npm.pkg.github.com
```

You will also need to be logged in to GitHub. An easy way to do so is to have a global `.npmrc` with your PAT ([personal access token][5]) set as an access token:

```npmrc
//npm.pkg.github.com/:_authToken=<your token here>
```

### CLI Usage

The package exposes a CLI interface with the following syntax:

```
generate-headers <tampermonkey | greasemonkey | violentmonkey> [options]
```

There are various options one can provide to customize the output:

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
  -l, --lint                 Lints the generated headers with ESLint
                                                      [boolean] [default: false]
      --lf, --lint-fix       Fixes lint issues found with ESLint (implies --lint
                             )                        [boolean] [default: false]
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

Some options accept shortcut values for convenience:

| Long    | Value                             | Description                                                                                                                                                                                                                                                                               | Since                                                    |
| ------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- | ------ |
| `grant` | `all`                             | Generates all `@grant` headers available for the userscript manager                                                                                                                                                                                                                       | v2.5.0                                                   |
| `match` | `all [template=https://domain/*]` | Fetches the current list of the Stack Exchange network sites and generates `@match` headers according to the `template`. The latter must contain the word `domain` — it will be replaced with the site domain for each of the generated entries.<br><br>Since v2.11.0, paths containing ` | `characters will be expanded, for example,`://test.com/a | b/c`will yield`://test.com/a/c`and`://test.com/b/c`. | v2.7.3 |
| `match` | `meta`                            | Generates `@match` headers for meta sites too (compatible with `all`)                                                                                                                                                                                                                     | v2.9.0                                                   |

A special `pretty` option improves the generated output while preserving backward compatibility:

| Header | Description                                          | Since | Example                                  |
| ------ | ---------------------------------------------------- | ----- | ---------------------------------------- |
| `name` | Splits the package name on `-` and capitalizes words | 2.6.0 | "generate-headers" -> "Generate Headers" |

### Valid grants

To use some of the sensitive functions exposed by userscript managers, you have to add a `@grant` header for each of those you use. Generate Headers standardizes and simplifies the process for you (with static analysis of your code coming soon). In both CLI and programmatic API, you can provide multiple grant values (i.e. `set`), and the package will generate appropriate headers:

| Value    | Tampermonkey         | Greasemonkey        | Violentmonkey                  |
| -------- | -------------------- | ------------------- | ------------------------------ |
| `set`    | `GM_setValue`        | `GM.setValue`       | `GM_setValue`                  |
| `get`    | `GM_getValue`        | `GM.getValue`       | `GM_getValue`                  |
| `delete` | `GM_deleteValue`     | `GM.deleteValue`    | `GM_deleteValue`               |
| `list`   | `GM_listValues`      | `GM.listValues`     | `GM_listValues`                |
| `unsafe` | `unsafeWindow`       | `unsafeWindow`      | `unsafeWindow`                 |
| `change` | `window.onurlchange` | -                   | -                              |
| `close`  | `window.close`       | -                   | `window.close`                 |
| `focus`  | `window.focus`       | -                   | `window.focus`                 |
| `notify` | -                    | `GM.notification`   | `GM_notification`              |
| `clip`   | -                    | `GM.setClipboard`   | `GM_setClipboard`              |
| `fetch`  | `GM_xmlhttpRequest`  | `GM.xmlHttpRequest` | `GM_xmlhttpRequest` (yes, `h`) |
| `style`  | -                    | -                   | `GM_addStyle`                  |

### Valid whitelists

When granted `GM_xmlhttpRequest`, Tampermonkey presents the user with a confirmation dialog every time the function is called. To avoid this, the script author must add [`@connect` headers][9] for each of the target domains or values with special semantics. The `whitelist` option generates these headers for you (no-op for other script managers):

| Value        | Description                           | Example            |
| ------------ | ------------------------------------- | ------------------ |
| `*`          | any domain                            | -                  |
| `localhost`  | localhost connection                  | -                  |
| `self`       | domain the script is running at       | -                  |
| IPv4 address | any valid IPv4 address                | `1.2.3.4`          |
| [FQDN][10]   | any valid fully qualified domain name | `tampermonkey.net` |

### Common and manager-specific headers

There are headers common to all userscript managers - for these, the package will source the values from your package.json file and convert the information into headers if available:

#### Common headers

| Header          | Package field  | Required | Description                                                                                               | Example                               |
| --------------- | -------------- | -------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `@author`       | `author`       | yes      | Author of the userscript. Parses both string and object patterns                                          | Oleg Valter <oleg.a.valter@gmail.com> |
| `@contributors` | `contributors` | no       | Contributors to the userscript. Greasemonkey will warn, but we believe contributors must always be listed | Double Beep                           |
| `@description`  | `description`  | yes      | Description of the userscript                                                                             | Userscript manager header generator   |
| `@icon`         | `icon`         | no       | Icon of the userscript                                                                                    | https://example.com/icon.svg          |
| `@name`         | `name`         | yes      | Name of the userscript (for [scoped packages][11] - value after the `/`)                                  | generate-headers                      |
| `@namespace`    | `name`         | no       | Namespace of the userscript - only present for scoped packages                                            | userscripters                         |
| `@noframes`     | -              | no       | Disallow the script from being loaded in `<iframe>`                                                       |
| `@version`      | `version`      | yes      | Version of the userscript (will be validated for correctness)                                             | 2.1.0                                 |

#### Tampermonkey headers

| Header         | Package field    | Required  | Description                   | Example                                                         |
| -------------- | ---------------- | --------- | ----------------------------- | --------------------------------------------------------------- |
| `@downloadURL` | `homepage`       | no        | Download URL override         | https://github.com/userscripters/generate-headers/dist/index.js |
| `@homepage`    | `homepage`       | no (^2.5) | Homepage of the userscript    | https://github.com/userscripters/generate-headers#readme        |
| `@supportURL`  | `bugs.url`       | no (^2.5) | Where to report issues        | https://github.com/userscripters/generate-headers/issues        |
| `@source`      | `repository.url` | no (^2.5) | Where to find the source code | git+https://github.com/userscripters/generate-headers.git       |
| `@updateURL`   | `homepage`       | no        | Update URL override           | https://github.com/userscripters/generate-headers/dist/index.js |

#### Violentmonkey headers

| Header         | Package field | Required  | Description                | Example                                                  |
| -------------- | ------------- | --------- | -------------------------- | -------------------------------------------------------- |
| `@homepageURL` | `homepage`    | no (^2.5) | Homepage of the userscript | https://github.com/userscripters/generate-headers#readme |
| `@supportURL`  | `bugs.url`    | no (^2.5) | Where to report issues     | https://github.com/userscripters/generate-headers/issues |

### Field and header validation

Since v2.0.0, the package validates `@match` headers according to the rules [specified here][8] (and that userscript managers follow). Providing incorrect values will result in an error message and those headers being dropped from the output:

[![invalid @match header value console message][12]][12]

Since v2.3.0, Generate Headers also checks the presence of required fields in package.json, as well as validates some of them for correctness. Contrary to the above, failing validation of these headers results in early termination, so _no output will be generated_:

| Field         | Validation                                       |
| ------------- | ------------------------------------------------ |
| `author`      | must be present                                  |
| `description` | must be present                                  |
| `name`        | must be present                                  |
| `homepage`    | homepage URL must be a valid URL                 |
| `version`     | the version must be a [valid semver][13] version |

And here is an example output if the package.json has major issues:

[![example output failing validation][14]][14]

Since v2.10.0, Generate Headers validates `@connect` headers for complying with allowed values (see the "Valid whitelists" section above for details). Just as with `@match` headers, incorrect values will be dropped from the output, and an error will be logged.

Since v2.12.0, Generate Headers validates `@require` headers for being valid URLs and not file URLs (as they are disallowed by userscript managers).

### Linting

Since v3.4.0, Generate Headers has `--lint` and `--lint-fix` options (both CLI and programmatic API) that integrate with the [eslint-plugin-userscripts](https://github.com/Yash-Singh1/eslint-plugin-userscripts) plugin for ESLint. The package guarantees that generated headers pass linting by default, but those options are useful if you want to enforce consistent addition of both `@homepage` and `@homepageURL` headers to userscript managers that support them, as well as for future-proofing against changes to metadata block schemas.

### Platform

This is a [Node.js][15] package (tested on LTS 16.13.2), so it requires Node to be installed. Best used with [TypeScript][16], but contains type declaration files for autocompletion as well.

Since v3.0.0, the package is distributed as ES modules and not CommonJS.

## Contact

Author: [Oleg Valter][17]<br>
Organization: [UserScripters][18]

Please, submit bug reports on the [source repository][19].<br>
Before adding a new one, please check if it hasn't been raised before.

You can also [drop by to chat][20], we are a friendly bunch.

## Code

[Source code][21] is written in TypeScript.

Contributions are welcome, you can always submit a [PR here][22].

[1]: https://docs.npmjs.com/creating-a-package-json-file
[2]: https://spdx.org/licenses/GPL-3.0-or-later
[3]: https://www.npmjs.com/package/@userscripters/generate-headers
[4]: https://github.com/userscripters/generate-headers/packages/817039
[5]: https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
[6]: https://nodejs.org/api/os.html#oseol
[7]: https://violentmonkey.github.io/api/metadata-block/#inject-into
[8]: https://developer.chrome.com/docs/extensions/mv3/match_patterns/
[9]: https://www.tampermonkey.net/documentation.php?ext=dhdg#_connect
[10]: https://en.wikipedia.org/wiki/Fully_qualified_domain_name
[11]: https://docs.npmjs.com/cli/v7/using-npm/scope
[12]: https://i.stack.imgur.com/gDHcw.png
[13]: https://semver.org/
[14]: https://i.stack.imgur.com/UoJUU.png
[15]: https://nodejs.org/en/
[16]: https://www.typescriptlang.org/download
[17]: https://stackoverflow.com/users/11407695/oleg-valter
[18]: https://github.com/userscripters
[19]: https://github.com/userscripters/generate-headers/issues
[20]: https://chat.stackoverflow.com/rooms/214345/userscript-newbies-and-friends
[21]: https://github.com/userscripters/generate-headers
[22]: https://github.com/userscripters/generate-headers/pulls
