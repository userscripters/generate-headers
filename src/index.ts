import { pathToFileURL } from "url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generate } from "./generate.js";
import type { GrantOptions, UserScriptManagerName } from "./generators/index.js";
import { scase } from "./utils/common.js";

const names: UserScriptManagerName[] = [
    "greasemonkey",
    "tampermonkey",
    "violentmonkey",
];

const cli = yargs(hideBin(process.argv));

const sharedOpts = {
    c: {
        alias: "collapse",
        default: true,
        description: "When using `match all <template>` option value, collapses all *.stackexchange.com sites into one wildcard match",
        type: "boolean",
    },
    d: {
        alias: "direct",
        default: false,
        description: "Directs headers content to `process.stdout`",
        type: "boolean",
    },
    du: {
        alias: "download-url",
        description: "URL for the @downloadURL header",
        type: "string"
    },
    e: {
        alias: "eol",
        default: "\n",
        description: "Sets the end-of-line character(s) (affects the check for existing headers)",
        type: "string",
    },
    g: {
        alias: "grant",
        description: "generates @grant headers, can be repeated",
        type: "array",
    },
    i: {
        alias: "inject",
        description: "Adds @inject-into header for Violentmonkey, no-op otherwise",
        type: "string",
    },
    m: {
        alias: "match",
        description: "generates valid @match headers (repeatable)",
        type: "array",
    },
    o: {
        alias: "output",
        default: "./dist/headers.js",
        description: "Creates and populates a file with headers content",
        type: "string",
    },
    p: {
        alias: "package",
        default: "./package.json",
        description: "Path to package.json to extract info from",
        type: "string",
    },
    q: {
        alias: "require",
        description: "generates valid @require headers (repeatable)",
        type: "array"
    },
    r: {
        alias: "run",
        default: "start",
        description: "Adds @run-at header (values missing in manager are silently dropped)",
        type: "string",
    },
    s: {
        alias: "spaces",
        default: 4,
        description: "number of spaces to indent header values with (total is the longest name + this value)",
        type: "number",
    },
    w: {
        alias: "whitelist",
        description: "generates @connect headers (repeatable)",
        type: "array",
    },
    pretty: {
        type: "boolean",
        default: false,
        description: "prettifies outputted headers where possible",
    },
} as const;

names.forEach((name) =>
    cli.command(
        name,
        `generates ${scase(name)} headers`,
        sharedOpts,
        ({ c, d, du, e, g = [], i, m = [], q = [], o, p, r = "start", s, pretty, w = [] }) =>
            void generate<GrantOptions>(name, {
                collapse: c,
                direct: !!d,
                downloadURL: du,
                eol: e,
                inject: i,
                matches: m.map(String),
                requires: q.map(String),
                grants: g as GrantOptions[],
                output: o,
                packagePath: p,
                run: r,
                spaces: s,
                pretty,
                whitelist: w.map(String)
            },
                import.meta.url === pathToFileURL(process.argv[1]).href
            )
    )
);

cli.demandCommand().help().parse();
