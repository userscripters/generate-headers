"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const chalk_1 = require("chalk");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const index_1 = require("./generators/greasemonkey/index");
const index_2 = require("./generators/tampermonkey/index");
const index_3 = require("./generators/violentmonkey/index");
const filesystem_1 = require("./utils/filesystem");
const package_1 = require("./utils/package");
const validators_1 = require("./utils/validators");
const generate = async (type, { packagePath, output, spaces = 4, eol, collapse = true, direct = false, matches = [], whitelist = [], ...rest }) => {
    const managerTypeMap = {
        greasemonkey: index_1.generateGreasemonkeyHeaders,
        tampermonkey: index_2.generateTampermonkeyHeaders,
        violentmonkey: index_3.generateViolentmonkeyHeaders,
    };
    try {
        const parsedPackage = await (0, package_1.getPackage)(packagePath);
        if (!parsedPackage) {
            console.log((0, chalk_1.bgRed) `missing or corrupted package`);
            return "";
        }
        const { invalid: matchInvalid, status: matchStatus, valid: validMatches } = (0, validators_1.validateMatchHeaders)(matches);
        if (!matchStatus) {
            console.log((0, chalk_1.bgRed) `Invalid @match headers:\n` + matchInvalid.join("\n"));
        }
        const { invalid: connectInvalid, status: connectStatus, valid: validConnects } = (0, validators_1.validateConnectHeaders)(whitelist);
        if (!connectStatus) {
            console.log((0, chalk_1.bgRed) `Invalid @connect headers:\n` + connectInvalid.join("\n"));
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
            matches: validMatches,
            whitelist: validConnects,
            spaces,
            packagePath,
            output,
        });
        if (!direct) {
            if (!(0, fs_1.existsSync)(output)) {
                await (0, promises_1.appendFile)(output, content, { encoding: "utf-8", flag: "w+" });
                return content;
            }
            const [openOffset, closeOffset] = await (0, validators_1.getExistingHeadersOffset)(output, eol);
            if (openOffset > -1 && closeOffset > -1) {
                await (0, filesystem_1.replaceFileContent)(output, openOffset, closeOffset, content);
                return content;
            }
            await (0, filesystem_1.replaceFileContent)(output, 0, 0, `${content}${eol}`);
            return content;
        }
        if (require.main === module)
            process.stdout.write(content);
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
