#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const generate_1 = require("./generate");
const common_1 = require("./utils/common");
const names = [
    "greasemonkey",
    "tampermonkey",
    "violentmonkey",
];
const cli = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv));
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
};
names.forEach((name) => cli.command(name, `generates ${(0, common_1.scase)(name)} headers`, sharedOpts, ({ c, d, e, g = [], i, m = [], q = [], o, p, r = "start", s, pretty, w = [] }) => void (0, generate_1.generate)(name, {
    collapse: c,
    direct: !!d,
    eol: e,
    inject: i,
    matches: m.map(String),
    requires: q.map(String),
    grants: g,
    output: o,
    packagePath: p,
    run: r,
    spaces: s,
    pretty,
    whitelist: w.map(String)
})));
cli.demandCommand().help().parse();
