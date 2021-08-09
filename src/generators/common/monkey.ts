import { CommonHeaders, HeaderEntries, HeaderEntry } from "..";
import { getLongest } from "../../utils";

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

export const finalizeMonkeyHeaders = <T extends CommonHeaders>(
    headers: HeaderEntries<T>,
    spaces: number
) => {
    const [openTag, closeTag] = makeMonkeyTags();

    const longest = getLongest(headers.map(([key]) => key as string)) + spaces;

    const indentedHeaders: HeaderEntries<T> = headers.map(([key, val]) => [
        key.padEnd(longest),
        val,
    ]);

    const parsedHeaders: MonkeyHeader[] = indentedHeaders
        .map(makeMonkeyHeader)
        .sort();

    return [openTag, ...parsedHeaders, closeTag].join("\n");
};
