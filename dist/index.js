#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const helpers_1 = require("yargs/helpers");
const generate_1 = require("./generate");
const common_1 = require("./utils/common");
const names = [
    "greasemonkey",
    "tampermonkey",
    "violentmonkey",
];
const cli = yargs((0, helpers_1.hideBin)(process.argv));
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
};
names.forEach((name) => cli.command(name, `generates ${(0, common_1.scase)(name)} headers`, sharedOpts, ({ c, d, g = [], i, m = [], o, p, r = "start", s, pretty }) => void (0, generate_1.generate)(name, {
    collapse: c,
    direct: !!d,
    inject: i,
    matches: m.map(String),
    grants: g,
    output: o,
    packagePath: p,
    run: r,
    spaces: s,
    pretty,
})));
cli.demandCommand().help().parse();
