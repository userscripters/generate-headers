import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generate } from "./generate";
import type { GrantOptions, UserScriptManagerName } from "./generators";
import { scase } from "./utils/common";

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
        type: "boolean",
    },
    d: {
        alias: "direct",
        default: false,
        type: "boolean",
    },
    e: {
        alias: "eol",
        default: "\n",
        type: "string",
    },
    g: {
        alias: "grant",
        type: "array",
    },
    i: {
        alias: "inject",
        type: "string",
    },
    m: {
        alias: "match",
        type: "array",
    },
    o: {
        alias: "output",
        default: "./dist/headers.js",
        type: "string",
    },
    p: {
        alias: "package",
        default: "./package.json",
        type: "string",
    },
    q: {
        alias: "require",
        type: "array"
    },
    r: {
        alias: "run",
        default: "start",
        type: "string",
    },
    s: {
        alias: "spaces",
        default: 4,
        type: "number",
    },
    w: {
        alias: "whitelist",
        type: "array",
    },
    pretty: {
        type: "boolean",
        default: false,
    },
} as const;

names.forEach((name) =>
    cli.command(
        name,
        `generates ${scase(name)} headers`,
        sharedOpts,
        ({ c, d, e, g = [], i, m = [], q = [], o, p, r = "start", s, pretty, w = [] }) =>
            void generate<GrantOptions>(name, {
                collapse: c,
                direct: !!d,
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
            })
    )
);

cli.demandCommand().help().parse();
