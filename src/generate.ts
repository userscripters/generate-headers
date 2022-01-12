import { bgRed } from "chalk";
import { appendFile } from "fs/promises";
import { generateGreasemonkeyHeaders } from "./generators/greasemonkey/index";
import type {
    GrantOptions,
    HeaderGenerator,
    UserScriptManagerName
} from "./generators/index";
import { generateTampermonkeyHeaders } from "./generators/tampermonkey/index";
import { generateViolentmonkeyHeaders } from "./generators/violentmonkey/index";
import { getPackage } from "./utils/package";
import {
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
    collapse: boolean;
    grants?: T[];
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
        collapse = true,
        direct = false,
        matches = [],
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

        const { invalid, status, valid } = validateMatchHeaders(matches);
        if (!status) {
            console.log(bgRed`Invalid @match headers:\n` + invalid.join("\n"));
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
            matches: valid,
            spaces,
            packagePath,
            output,
        });

        if (!direct) {
            await appendFile(output!, content, { encoding: "utf-8", flag: "w+" });
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
            default: ({ message }) => ["Something went wrong:", message],
        };

        const handler = errMap[code || "default"];

        const [postfix, message] = handler(exceptionObject);

        console.log(bgRed`[${name}] ${postfix}` + `\n\n${message}`);

        return "";
    }
};
