import { bgRed } from 'chalk';
// import { ENOENT } from "constants";
import { appendFile } from 'fs/promises';
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
    generateGreasemnonkeyHeaders,
    generateTampermonkeyHeaders,
    generateViolentMonkeyHeaders,
    GeneratorMap,
    UserScriptManagerName,
} from './generators';
import { getPackage, scase } from './utils';

const names: UserScriptManagerName[] = [
    'greasemonkey',
    'tampermonkey',
    'violentmonkey',
];

export const generate = async (
    type: UserScriptManagerName,
    packagePath: string,
    output: string
) => {
    const managerTypeMap: GeneratorMap = {
        greasemonkey: generateGreasemnonkeyHeaders,
        tampermonkey: generateTampermonkeyHeaders,
        violentmonkey: generateViolentMonkeyHeaders,
    };

    try {
        const parsedPackage = await getPackage(packagePath);

        if (!parsedPackage) return console.log(bgRed`missing or corrupted package`);

        const content = managerTypeMap[type!](parsedPackage);

        await appendFile(output!, content, { encoding: 'utf-8', flag: 'w+' });
    } catch (error) {
        const { code, name } = error;
        const errMap: {
      [code: string]: (err: NodeJS.ErrnoException) => [string, string];
    } = {
        ENOENT: ({ path }) => ['Missing path:', path!],
    };

        const [postfix, message] = errMap[code](error);

        console.log(bgRed`[${name}] ${postfix}` + `\n\n${message}`);
    }
};

const cli = yargs(hideBin(process.argv));

const sharedOpts = {
    o: {
        alias: 'output',
        default: './dist/headers.js',
    },
    p: {
        alias: 'package',
        default: './package.json',
        type: 'string',
    },
} as const;

names.forEach((name) =>
    cli.command(
        name,
        `generates ${scase(name)} headers`,
        sharedOpts,
        ({ o, p }) => generate(name, p, o)
    )
);

cli.demandCommand().help().parse();
