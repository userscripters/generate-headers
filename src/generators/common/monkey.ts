import { CommonHeaders, HeaderEntry } from "..";

export type MonkeyHeader = `// @${string} ${string}` | `// @${string}`;

export const makeMonkeyTags = (
    name = "UserScript"
): readonly [openTag: string, closeTag: string] => [
    `// ==${name}==`,
    `// ==/${name}==`,
];

export const makeMonkeyHeader = <T extends CommonHeaders>([
    name,
    value,
]: HeaderEntry<T>) =>
    <MonkeyHeader>(value ? `// @${name} ${value}` : `// @${name}`);
