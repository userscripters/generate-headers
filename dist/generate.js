import chulk from "chalk";
import { existsSync } from "fs";
import { appendFile } from "fs/promises";
import { generateGreasemonkeyHeaders } from "./generators/greasemonkey/index.js";
import { generateTampermonkeyHeaders } from "./generators/tampermonkey/index.js";
import { generateViolentmonkeyHeaders } from "./generators/violentmonkey/index.js";
import { replaceFileContent } from "./utils/filesystem.js";
import { getPackage } from "./utils/package.js";
import { getExistingHeadersOffset, validateConnectHeaders, validateExcludeHeaders, validateMatchHeaders, validateOptionalHeaders, validateRequiredHeaders } from "./utils/validators.js";
export const generate = async (type, options, cli = false) => {
    const { packagePath, output, spaces = 4, eol, collapse = true, direct = false, excludes = [], matches = [], whitelist = [], ...rest } = options;
    const managerTypeMap = {
        greasemonkey: generateGreasemonkeyHeaders,
        tampermonkey: generateTampermonkeyHeaders,
        violentmonkey: generateViolentmonkeyHeaders,
    };
    try {
        const parsedPackage = await getPackage(packagePath);
        if (!parsedPackage) {
            console.log(chulk.bgRed `missing or corrupted package`);
            return "";
        }
        const { invalid: matchInvalid, status: matchStatus, valid: validMatches } = validateMatchHeaders(matches);
        if (!matchStatus) {
            console.log(chulk.bgRed `Invalid @match headers:\n` + matchInvalid.join("\n"));
        }
        const { invalid: excludeInvalid, status: excludeStatus, valid: validExcludes } = validateExcludeHeaders(excludes);
        if (!excludeStatus) {
            console.log(chulk.bgRed `Invalid @exclude headers:\n` + excludeInvalid.join("\n"));
        }
        const { invalid: connectInvalid, status: connectStatus, valid: validConnects } = validateConnectHeaders(whitelist);
        if (!connectStatus) {
            console.log(chulk.bgRed `Invalid @connect headers:\n` + connectInvalid.join("\n"));
        }
        const { status: reqStatus, isValidHomepage, isValidVersion, missing, } = validateRequiredHeaders(parsedPackage);
        if (!isValidHomepage) {
            console.log(chulk.bgRed `Invalid homepage URL:\n` + parsedPackage.homepage);
        }
        const { isValidDownloadURL } = validateOptionalHeaders(options);
        if (!isValidDownloadURL) {
            console.log(chulk.bgRed `Invalid @downloadURL:\n` + options.downloadURL);
        }
        if (!isValidVersion) {
            console.log(chulk.bgRed `Invalid version:\n` + parsedPackage.version);
        }
        if (missing.length) {
            console.log(chulk.bgRed `Missing required fields:\n` + missing.join("\n"));
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
            await replaceFileContent(output, 0, 0, `${content}${eol}`);
            return content;
        }
        if (cli)
            process.stdout.write(content);
        return content;
    }
    catch (error) {
        const exceptionObject = error;
        const { code, name } = exceptionObject;
        const errMap = {
            ENOENT: ({ path }) => ["Missing path:", path],
            ENOTFOUND: ({ message }) => ["Network failure:", message],
            default: ({ message }) => ["Something went wrong:", message],
        };
        const handler = errMap[code || "default"] || errMap.default;
        const [postfix, message] = handler(exceptionObject);
        console.log(chulk.bgRed `[${name}] ${postfix}` + `\n\n${message}`);
        return "";
    }
};
