import { bgRed } from "chalk";
import { appendFile } from "fs/promises";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
    GrantOptions,
    HeaderGenerator,
    UserScriptManagerName,
} from "./generators";
import { generateGreasemonkeyHeaders } from "./generators/greasemonkey";
import { generateTampermonkeyHeaders } from "./generators/tampermonkey";
import { generateViolentmonkeyHeaders } from "./generators/violentmonkey";
import { scase } from "./utils/common";
import { getPackage } from "./utils/package";
import {
    validateMatchHeaders,
    validateRequiredHeaders,
} from "./utils/validators";

const names: UserScriptManagerName[] = [
    "greasemonkey",
    "tampermonkey",
    "violentmonkey",
];

export type GeneratorOptions<T extends GrantOptions> = {
    packagePath: string;
    output: string;
    spaces?: number;
    inject?: string;
    matches?: string[];
    grants?: T[];
    direct?: boolean;
};

export const generate = async <T extends GrantOptions>(
    type: UserScriptManagerName,
    {
        packagePath,
        output,
        spaces = 4,
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

        const content = handler(parsedPackage, {
            ...rest,
            matches: valid,
            spaces,
            packagePath,
            output,
        });

        //running from CLI with file emit disabled
        if (direct && require.main === module) process.stdout.write(content);

        if (direct) return content;

        await appendFile(output!, content, { encoding: "utf-8", flag: "w+" });

        return content;
    } catch (error) {
        const { code, name } = error;
        const errMap: {
            [code: string]: (err: NodeJS.ErrnoException) => [string, string];
        } = {
            ENOENT: ({ path }) => ["Missing path:", path!],
            default: ({ message }) => ["Something went wrong:", message],
        };

        const handler = errMap[code] || errMap.default;

        const [postfix, message] = handler(error);

        console.log(bgRed`[${name}] ${postfix}` + `\n\n${message}`);

        return "";
    }
};

const cli = yargs(hideBin(process.argv));

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
    s: {
        alias: "spaces",
        default: 4,
        type: "number",
    },
} as const;

names.forEach((name) =>
    cli.command(
        name,
        `generates ${scase(name)} headers`,
        sharedOpts,
        ({ d, g = [], i = "page", m = [], o, p, s }) =>
            generate<GrantOptions>(name, {
                direct: !!d,
                inject: i,
                matches: m.map(String),
                grants: g as GrantOptions[],
                output: o,
                packagePath: p,
                spaces: s,
            })
    )
);

cli.demandCommand().help().parse();
