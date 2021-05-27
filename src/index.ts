import { bgRed } from "chalk";
import { writeFile } from "fs/promises";
import * as yargs from "yargs";
import {
  generateGreasemnonkeyHeaders,
  generateTampermonkeyHeaders,
  generateViolentMonkeyHeaders,
  GeneratorMap,
  UserScriptManagerName,
} from "./generators";
import { getPackage } from "./utils";

const names: UserScriptManagerName[] = [
  "greasemonkey",
  "tampermonkey",
  "violentmonkey",
];

type ParsedArgs = Partial<{
  output: string;
  package: string;
  type: UserScriptManagerName;
}>;

const cli = yargs(process.argv.slice(2));
cli.option("o", {
  alias: "output",
  default: "./dist/headers.js",
});
cli.option("p", {
  alias: "package",
  default: "./package.json",
  type: "string",
});
cli.option("t", {
  alias: "type",
  choices: names,
  description: "choose userscript type",
  demandOption: true,
  type: "string",
});

export const generate = async () => {
  const parsed = await cli.parse();

  const { type, output, package: path } = <ParsedArgs>parsed;

  const managerTypeMap: GeneratorMap = {
    greasemonkey: generateGreasemnonkeyHeaders,
    tampermonkey: generateTampermonkeyHeaders,
    violentmonkey: generateViolentMonkeyHeaders,
  };

  try {
    const parsedPackage = await getPackage(path!);

    if (!parsedPackage) return console.log(bgRed`missing or corrupted package`);

    const content = managerTypeMap[type!](parsedPackage);

    await writeFile(output!, content, { encoding: "utf-8" });
  } catch ({ message }) {
    console.log(bgRed`failed to generate headers: ${message}`);
  }
};

generate();
