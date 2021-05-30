import { bgRed } from "chalk";
import { appendFile } from "fs/promises";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
    generateGreasemnonkeyHeaders,
    generateTampermonkeyHeaders,
    generateViolentMonkeyHeaders,
    GeneratorMap,
    UserScriptManagerName
} from "./generators";
import { getPackage, scase } from "./utils";

const names: UserScriptManagerName[] = [
    "greasemonkey",
    "tampermonkey",
    "violentmonkey",
];

type GeneratorOptions = {
  packagePath: string;
  output: string;
  spaces?: number;
  direct?: boolean;
};

export const generate = async (
    type: UserScriptManagerName,
    { packagePath, output, spaces = 4, direct = false }: GeneratorOptions
) => {
    const managerTypeMap: GeneratorMap = {
        greasemonkey: generateGreasemnonkeyHeaders,
        tampermonkey: generateTampermonkeyHeaders,
        violentmonkey: generateViolentMonkeyHeaders,
    };

    try {
        const parsedPackage = await getPackage(packagePath);

        if (!parsedPackage) {
            console.log(bgRed`missing or corrupted package`);
            return "";
        }

        const content = managerTypeMap[type!](parsedPackage, spaces);

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
        ({ d, o, p, s }) =>
            generate(name, {
                direct: !!d,
                output: o,
                packagePath: p,
                spaces: s,
            })
    )
);

cli
    .demandCommand()
    .help()
    .parse();
