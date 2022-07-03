import chulk from "chalk";
import { existsSync } from "fs";
import { appendFile } from "fs/promises";
import type { CommonGeneratorOptions } from "./generators/common/index.js";
import { generateGreasemonkeyHeaders } from "./generators/greasemonkey/index.js";
import type {
    GrantOptions,
    HeaderGenerator,
    UserScriptManagerName
} from "./generators/index.js";
import { generateTampermonkeyHeaders } from "./generators/tampermonkey/index.js";
import { generateViolentmonkeyHeaders } from "./generators/violentmonkey/index.js";
import { lintHeaders } from "./linters/index.js";
import { replaceFileContent } from "./utils/filesystem.js";
import { getPackage } from "./utils/package.js";
import {
    getExistingHeadersOffset,
    validateConnectHeaders,
    validateExcludeHeaders,
    validateMatchHeaders,
    validateOptionalHeaders,
    validateRequiredHeaders
} from "./utils/validators.js";

export type RunAtOption = "start" | "end" | "idle" | "body" | "menu";

export type GeneratorOptions<T extends GrantOptions> = CommonGeneratorOptions & {
    collapse: boolean;
    custom?: string[];
    direct?: boolean;
    downloadURL?: string;
    eol?: string;
    excludes?: string[];
    fix?: boolean;
    grants?: T[];
    homepage?: string;
    inject?: string;
    lint?: boolean;
    matches?: string[];
    output: string;
    packagePath: string;
    pretty?: boolean;
    requires?: string[];
    run?: RunAtOption;
    spaces?: number;
    updateURL?: string;
    whitelist?: Array<"self" | "localhost" | "*"> | string[];
};

export type WriteHeadersOptions = {
    cli: boolean;
    direct: boolean;
    eol?: string;
    output: string;
};

export const managersSupportingHomepage = new Set<UserScriptManagerName>(
    ["tampermonkey", "violentmonkey"]
);

/**
 * @summary writes the generated headers to a file or to stdout
 * @param content generated headers
 * @param options configuration options
 */
export const writeHeaders = async (content: string, options: WriteHeadersOptions): Promise<string> => {
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

        await replaceFileContent(output, 0, 0, `${content}${eol}`);
        return content;
    }

    //running from CLI with file emit disabled
    if (cli) process.stdout.write(content);

    return content;
};

/**
 * @summary main header generator function
 * @param type userscript manager type
 * @param options generator configuration
 * @param cli is running as a CLI?
 */
export const generate = async <T extends GrantOptions>(
    type: UserScriptManagerName,
    options: GeneratorOptions<T>,
    cli = false
): Promise<string> => {
    const {
        packagePath,
        output,
        spaces = 4,
        eol,
        fix = false,
        collapse = true,
        direct = false,
        excludes = [],
        lint = false,
        matches = [],
        whitelist = [],
        ...rest
    } = options;

    const managerTypeMap = {
        greasemonkey: generateGreasemonkeyHeaders,
        tampermonkey: generateTampermonkeyHeaders,
        violentmonkey: generateViolentmonkeyHeaders,
    };

    try {
        const parsedPackage = await getPackage(packagePath);

        if (!parsedPackage) {
            console.error(chulk.bgRed`missing or corrupted package`);
            return "";
        }

        const {
            invalid: matchInvalid,
            status: matchStatus,
            valid: validMatches
        } = validateMatchHeaders(matches);
        if (!matchStatus) {
            console.error(chulk.bgRed`Invalid @match headers:\n` + matchInvalid.join("\n"));
        }

        const {
            invalid: excludeInvalid,
            status: excludeStatus,
            valid: validExcludes
        } = validateExcludeHeaders(excludes);
        if (!excludeStatus) {
            console.error(chulk.bgRed`Invalid @exclude headers:\n` + excludeInvalid.join("\n"));
        }

        const {
            invalid: connectInvalid,
            status: connectStatus,
            valid: validConnects
        } = validateConnectHeaders(whitelist);
        if (!connectStatus) {
            console.error(chulk.bgRed`Invalid @connect headers:\n` + connectInvalid.join("\n"));
        }

        const {
            status: reqStatus,
            isValidHomepage,
            isValidVersion,
            missing,
        } = validateRequiredHeaders(parsedPackage);

        if (!isValidHomepage) {
            console.error(chulk.bgRed`Invalid homepage URL:\n` + parsedPackage.homepage);
        }

        const { isValidDownloadURL } = validateOptionalHeaders(options);

        if (!isValidDownloadURL) {
            console.error(chulk.bgRed`Invalid @downloadURL:\n` + options.downloadURL);
        }

        if (!isValidVersion) {
            console.error(chulk.bgRed`Invalid version:\n` + parsedPackage.version);
        }

        if (missing.length) {
            console.error(chulk.bgRed`Missing required fields:\n` + missing.join("\n"));
        }

        if (!reqStatus) return "";

        const handler = managerTypeMap[type] as HeaderGenerator<T>;

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
            if (error) console.error(error); // 'error' contains a preformatted string
            return writeHeaders(headers, { cli, direct, eol, output });
        }

        return writeHeaders(content, { cli, direct, eol, output });
    } catch (error) {
        const exceptionObject = error as NodeJS.ErrnoException;
        const { code, name } = exceptionObject;
        const errMap: {
            [code: string]: (err: NodeJS.ErrnoException) => [string, string];
        } = {
            ENOENT: ({ path }) => ["Missing path:", path!],
            ENOTFOUND: ({ message }) => ["Network failure:", message],
            default: ({ message }) => ["Something went wrong:", message],
        };

        const handler = errMap[code || "default"] || errMap.default;

        const [postfix, message] = handler(exceptionObject);

        console.error(chulk.bgRed`[${name}] ${postfix}` + `\n\n${message}`);

        return "";
    }
};
