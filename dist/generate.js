import chulk from "chalk";
import { existsSync } from "fs";
import { appendFile } from "fs/promises";
import { generateGreasemonkeyHeaders } from "./generators/greasemonkey/index.js";
import { generateTampermonkeyHeaders } from "./generators/tampermonkey/index.js";
import { generateViolentmonkeyHeaders } from "./generators/violentmonkey/index.js";
import { lintHeaders } from "./linters/index.js";
import { replaceFileContent } from "./utils/filesystem.js";
import { getPackage } from "./utils/package.js";
import { getExistingHeadersOffset, validateConnectHeaders, validateExcludeHeaders, validateMatchHeaders, validateOptionalHeaders, validateRequiredHeaders, } from "./utils/validators.js";
export const managersSupportingHomepage = new Set(["tampermonkey", "violentmonkey"]);
export const writeHeaders = async (content, options) => {
    const { cli, direct, eol, output } = options;
    if (!direct) {
        if (!existsSync(output)) {
            await appendFile(output, content, { encoding: "utf-8", flag: "w+" });
            return content;
        }
        const [openOffset, closeOffset] = await getExistingHeadersOffset(output, eol);
        if (openOffset > -1 && closeOffset > -1) {
            await replaceFileContent(output, openOffset, closeOffset, content);
            return content;
        }
        await replaceFileContent(output, 0, 0, `${content}${eol || ""}`);
        return content;
    }
    if (cli)
        process.stdout.write(content);
    return content;
};
export const generate = async (type, options, cli = false) => {
    const { packagePath, output, spaces = 4, eol, fix = false, collapse = true, direct = false, excludes = [], lint = false, matches = [], whitelist = [], ...rest } = options;
    const managerTypeMap = {
        greasemonkey: generateGreasemonkeyHeaders,
        tampermonkey: generateTampermonkeyHeaders,
        violentmonkey: generateViolentmonkeyHeaders,
    };
    try {
        const parsedPackage = await getPackage(packagePath);
        if (!parsedPackage) {
            console.error(chulk.bgRed `missing or corrupted package`);
            return "";
        }
        const { invalid: matchInvalid, status: matchStatus, valid: validMatches, } = validateMatchHeaders(matches);
        if (!matchStatus) {
            console.error(chulk.bgRed `Invalid @match headers:\n` + matchInvalid.join("\n"));
        }
        const { invalid: excludeInvalid, status: excludeStatus, valid: validExcludes, } = validateExcludeHeaders(excludes);
        if (!excludeStatus) {
            console.error(chulk.bgRed `Invalid @exclude headers:\n` + excludeInvalid.join("\n"));
        }
        const { invalid: connectInvalid, status: connectStatus, valid: validConnects, } = validateConnectHeaders(whitelist);
        if (!connectStatus) {
            console.error(chulk.bgRed `Invalid @connect headers:\n` + connectInvalid.join("\n"));
        }
        const { status: reqStatus, isValidHomepage, isValidVersion, missing, } = validateRequiredHeaders(parsedPackage);
        if (!isValidHomepage) {
            console.error(chulk.bgRed `Invalid homepage URL:\n` + parsedPackage.homepage);
        }
        const { isValidDownloadURL } = validateOptionalHeaders(options);
        if (!isValidDownloadURL && options.downloadURL) {
            console.error(chulk.bgRed `Invalid @downloadURL:\n` + options.downloadURL);
        }
        if (!isValidVersion) {
            console.error(chulk.bgRed `Invalid version:\n` + parsedPackage.version);
        }
        if (missing.length) {
            console.error(chulk.bgRed `Missing required fields:\n` + missing.join("\n"));
        }
        if (!reqStatus)
            return "";
        const handler = managerTypeMap[type];
        const content = await handler(parsedPackage, {
            ...rest,
            collapse,
            excludes: validExcludes,
            matches: validMatches,
            whitelist: validConnects,
            spaces,
            packagePath,
            output,
        });
        if (lint || fix) {
            const { error, headers } = await lintHeaders(content, {
                fix,
                spaces,
                isHomepageAllowed: managersSupportingHomepage.has(type),
            });
            if (error)
                console.error(error);
            return await writeHeaders(headers, { cli, direct, eol, output });
        }
        return await writeHeaders(content, { cli, direct, eol, output });
    }
    catch (error) {
        const exceptionObject = error;
        const { code, name } = exceptionObject;
        const errMap = {
            ENOENT: ({ path }) => ["Missing path:", path || ""],
            ENOTFOUND: ({ message }) => ["Network failure:", message],
            default: ({ message }) => ["Something went wrong:", message],
        };
        const key = code === "ENOENT" || code === "ENOTFOUND" ? code : "default";
        const handler = errMap[key];
        const [postfix, message] = handler(exceptionObject);
        console.error(chulk.bgRed `[${name}] ${postfix}` + `\n\n${message}`);
        return "";
    }
};
