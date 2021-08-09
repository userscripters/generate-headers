import { bgRed } from "chalk";
import { appendFile } from "fs/promises";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
    GeneratorMap,
    GrantOptions,
    UserScriptManagerName,
} from "./generators";
import { generateGreasemonkeyHeaders } from "./generators/greasemonkey";
import { generateTampermonkeyHeaders } from "./generators/tampermonkey";
import { generateViolentMonkeyHeaders } from "./generators/violentmonkey";
import { scase } from "./utils";
import { getPackage } from "./utils/package";

const names: UserScriptManagerName[] = [
    "greasemonkey",
    "tampermonkey",
    "violentmonkey",
];

export type GeneratorOptions = {
    packagePath: string;
    output: string;
    spaces?: number;
    matches?: string[];
    grants?: GrantOptions[];
    direct?: boolean;
};

export const generate = async (
    type: UserScriptManagerName,
    {
        packagePath,
        output,
        spaces = 4,
        direct = false,
        ...rest
    }: GeneratorOptions
) => {
    const managerTypeMap: GeneratorMap = {
        greasemonkey: generateGreasemonkeyHeaders,
        tampermonkey: generateTampermonkeyHeaders,
        violentmonkey: generateViolentMonkeyHeaders,
    };

    try {
        const parsedPackage = await getPackage(packagePath);

        if (!parsedPackage) {
            console.log(bgRed`missing or corrupted package`);
            return "";
        }

        const content = managerTypeMap[type!](parsedPackage, {
            ...rest,
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
        ({ d, g = [], m = [], o, p, s }) =>
            generate(name, {
                direct: !!d,
                matches: m.map(String),
                grants: g as GrantOptions[],
                output: o,
                packagePath: p,
                spaces: s,
            })
    )
);

cli.demandCommand().help().parse();
