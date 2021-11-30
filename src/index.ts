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
        ({ c, d, g = [], i, m = [], o, p, r = "start", s, pretty }) =>
            void generate<GrantOptions>(name, {
                collapse: c,
                direct: !!d,
                inject: i,
                matches: m.map(String),
                grants: g as GrantOptions[],
                output: o,
                packagePath: p,
                run: r,
                spaces: s,
                pretty,
            })
    )
);

cli.demandCommand().help().parse();
