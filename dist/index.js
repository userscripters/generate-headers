#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const chalk_1 = require("chalk");
const promises_1 = require("fs/promises");
const yargs = require("yargs");
const helpers_1 = require("yargs/helpers");
const generators_1 = require("./generators");
const utils_1 = require("./utils");
const names = [
    "greasemonkey",
    "tampermonkey",
    "violentmonkey",
];
const generate = async (type, { packagePath, output, spaces = 4, direct = false }) => {
    const managerTypeMap = {
        greasemonkey: generators_1.generateGreasemnonkeyHeaders,
        tampermonkey: generators_1.generateTampermonkeyHeaders,
        violentmonkey: generators_1.generateViolentMonkeyHeaders,
    };
    try {
        const parsedPackage = await utils_1.getPackage(packagePath);
        if (!parsedPackage) {
            console.log(chalk_1.bgRed `missing or corrupted package`);
            return "";
        }
        const content = managerTypeMap[type](parsedPackage, spaces);
        if (direct)
            return content;
        await promises_1.appendFile(output, content, { encoding: "utf-8", flag: "w+" });
        return content;
    }
    catch (error) {
        const { code, name } = error;
        const errMap = {
            ENOENT: ({ path }) => ["Missing path:", path],
            default: ({ message }) => ["Something went wrong:", message],
        };
        const handler = errMap[code] || errMap.default;
        const [postfix, message] = handler(error);
        console.log(chalk_1.bgRed `[${name}] ${postfix}` + `\n\n${message}`);
        return "";
    }
};
exports.generate = generate;
const cli = yargs(helpers_1.hideBin(process.argv));
const sharedOpts = {
    d: {
        alias: "direct",
        default: false,
        type: "boolean",
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
    s: {
        alias: "spaces",
        default: 4,
        type: "number",
    },
};
names.forEach((name) => cli.command(name, `generates ${utils_1.scase(name)} headers`, sharedOpts, ({ d, o, p, s }) => exports.generate(name, {
    direct: !!d,
    output: o,
    packagePath: p,
    spaces: s,
})));
cli
    .middleware(({ d, o }) => {
    console.log({ d, o }, process.argv);
})
    .demandCommand()
    .help()
    .parse();
