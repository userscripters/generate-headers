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
const generate = async (type, { packagePath, output, spaces = 4, collapse = false, direct = false, matches = [], ...rest }) => {
    const managerTypeMap = {
        greasemonkey: greasemonkey_1.generateGreasemonkeyHeaders,
        tampermonkey: tampermonkey_1.generateTampermonkeyHeaders,
        violentmonkey: violentmonkey_1.generateViolentmonkeyHeaders,
    };
    try {
        const parsedPackage = await (0, package_1.getPackage)(packagePath);
        if (!parsedPackage) {
            console.log((0, chalk_1.bgRed) `missing or corrupted package`);
            return "";
        }
        const { invalid, status, valid } = (0, validators_1.validateMatchHeaders)(matches);
        if (!status) {
            console.log((0, chalk_1.bgRed) `Invalid @match headers:\n` + invalid.join("\n"));
        }
        const { status: reqStatus, isValidHomepage, isValidVersion, missing, } = (0, validators_1.validateRequiredHeaders)(parsedPackage);
        if (!isValidHomepage) {
            console.log((0, chalk_1.bgRed) `Invalid homepage URL:\n` + parsedPackage.homepage);
        }
        if (!isValidVersion) {
            console.log((0, chalk_1.bgRed) `Invalid version:\n` + parsedPackage.version);
        }
        if (missing.length) {
            console.log((0, chalk_1.bgRed) `Missing required fields:\n` + missing.join("\n"));
        }
        if (!reqStatus)
            return "";
        const handler = managerTypeMap[type];
        const content = await handler(parsedPackage, {
            ...rest,
            collapse,
            matches: valid,
            spaces,
            packagePath,
            output,
        });
        if (direct && require.main === module)
            process.stdout.write(content);
        if (direct)
            return content;
        await (0, promises_1.appendFile)(output, content, { encoding: "utf-8", flag: "w+" });
        return content;
    }
    catch (error) {
        const exceptionObject = error;
        const { code, name } = exceptionObject;
        const errMap = {
            ENOENT: ({ path }) => ["Missing path:", path],
            default: ({ message }) => ["Something went wrong:", message],
        };
        const handler = errMap[code || "default"];
        const [postfix, message] = handler(exceptionObject);
        console.log((0, chalk_1.bgRed) `[${name}] ${postfix}` + `\n\n${message}`);
        return "";
    }
};
exports.generate = generate;
const cli = yargs((0, helpers_1.hideBin)(process.argv));
const sharedOpts = {
    c: {
        alias: "collapse",
        default: false,
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
names.forEach((name) => cli.command(name, `generates ${(0, common_1.scase)(name)} headers`, sharedOpts, ({ c, d, g = [], i, m = [], o, p, r = "start", s, pretty }) => void (0, exports.generate)(name, {
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
