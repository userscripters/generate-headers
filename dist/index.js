#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const chalk_1 = require("chalk");
const promises_1 = require("fs/promises");
const yargs = require("yargs");
const helpers_1 = require("yargs/helpers");
const greasemonkey_1 = require("./generators/greasemonkey");
const tampermonkey_1 = require("./generators/tampermonkey");
const violentmonkey_1 = require("./generators/violentmonkey");
const common_1 = require("./utils/common");
const package_1 = require("./utils/package");
const validators_1 = require("./utils/validators");
const names = [
    "greasemonkey",
    "tampermonkey",
    "violentmonkey",
];
const generate = async (type, { packagePath, output, spaces = 4, direct = false, matches = [], ...rest }) => {
    const managerTypeMap = {
        greasemonkey: greasemonkey_1.generateGreasemonkeyHeaders,
        tampermonkey: tampermonkey_1.generateTampermonkeyHeaders,
        violentmonkey: violentmonkey_1.generateViolentmonkeyHeaders,
    };
    try {
        const parsedPackage = await package_1.getPackage(packagePath);
        if (!parsedPackage) {
            console.log(chalk_1.bgRed `missing or corrupted package`);
            return "";
        }
        const { invalid, status, valid } = validators_1.validateMatchHeaders(matches);
        if (!status) {
            console.log(chalk_1.bgRed `Invalid @match headers:\n` + invalid.join("\n"));
        }
        const { status: reqStatus, isValidHomepage, isValidVersion, missing, } = validators_1.validateRequiredHeaders(parsedPackage);
        if (!isValidHomepage) {
            console.log(chalk_1.bgRed `Invalid homepage URL:\n` + parsedPackage.homepage);
        }
        if (!isValidVersion) {
            console.log(chalk_1.bgRed `Invalid version:\n` + parsedPackage.version);
        }
        if (missing.length) {
            console.log(chalk_1.bgRed `Missing required fields:\n` + missing.join("\n"));
        }
        if (!reqStatus)
            return "";
        const handler = managerTypeMap[type];
        const content = handler(parsedPackage, {
            ...rest,
            matches: valid,
            spaces,
            packagePath,
            output,
        });
        if (direct && require.main === module)
            process.stdout.write(content);
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
names.forEach((name) => cli.command(name, `generates ${common_1.scase(name)} headers`, sharedOpts, ({ d, g = [], i, m = [], o, p, r = "start", s, pretty }) => exports.generate(name, {
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
