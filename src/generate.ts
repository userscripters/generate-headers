import { bgRed } from "chalk";
import { existsSync } from "fs";
import { appendFile } from "fs/promises";
import { generateGreasemonkeyHeaders } from "./generators/greasemonkey/index";
import type {
    GrantOptions,
    HeaderGenerator,
    UserScriptManagerName
} from "./generators/index";
import { generateTampermonkeyHeaders } from "./generators/tampermonkey/index";
import { generateViolentmonkeyHeaders } from "./generators/violentmonkey/index";
import { replaceFileContent } from "./utils/filesystem";
import { getPackage } from "./utils/package";
import {
    getExistingHeadersOffset,
    validateConnectHeaders,
    validateMatchHeaders,
    validateRequiredHeaders
} from "./utils/validators";

export type RunAtOption = "start" | "end" | "idle" | "body" | "menu";

export type GeneratorOptions<T extends GrantOptions> = {
    packagePath: string;
    output: string;
    spaces?: number;
    inject?: string;
    matches?: string[];
    requires?: string[];
    collapse: boolean;
    eol?: string;
    grants?: T[];
    whitelist?: Array<"self" | "localhost" | "*"> | string[];
    run?: RunAtOption;
    direct?: boolean;
    pretty?: boolean;
};

export const generate = async <T extends GrantOptions>(
    type: UserScriptManagerName,
    {
        packagePath,
        output,
        spaces = 4,
        eol,
        collapse = true,
        direct = false,
        matches = [],
        whitelist = [],
        ...rest
    }: GeneratorOptions<T>
) => {
    const managerTypeMap = {
        greasemonkey: generateGreasemonkeyHeaders,
        tampermonkey: generateTampermonkeyHeaders,
        violentmonkey: generateViolentmonkeyHeaders,
    };

    try {
        const parsedPackage = await getPackage(packagePath);

        if (!parsedPackage) {
            console.log(bgRed`missing or corrupted package`);
            return "";
        }

        const {
            invalid: matchInvalid,
            status: matchStatus,
            valid: validMatches
        } = validateMatchHeaders(matches);
        if (!matchStatus) {
            console.log(bgRed`Invalid @match headers:\n` + matchInvalid.join("\n"));
        }

        const {
            invalid: connectInvalid,
            status: connectStatus,
            valid: validConnects
        } = validateConnectHeaders(whitelist);
        if (!connectStatus) {
            console.log(bgRed`Invalid @connect headers:\n` + connectInvalid.join("\n"));
        }

        const {
            status: reqStatus,
            isValidHomepage,
            isValidVersion,
            missing,
        } = validateRequiredHeaders(parsedPackage);

        if (!isValidHomepage) {
            console.log(
                bgRed`Invalid homepage URL:\n` + parsedPackage.homepage
            );
        }

        if (!isValidVersion) {
            console.log(bgRed`Invalid version:\n` + parsedPackage.version);
        }

        if (missing.length) {
            console.log(bgRed`Missing required fields:\n` + missing.join("\n"));
        }

        if (!reqStatus) return "";

        const handler = managerTypeMap[type] as HeaderGenerator<T>;

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
        if (require.main === module) process.stdout.write(content);

        return content;
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

        console.log(bgRed`[${name}] ${postfix}` + `\n\n${message}`);

        return "";
    }
};
