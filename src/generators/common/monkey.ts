import { getLongest } from "../../utils/common.js";
import type { HeaderEntries, HeaderEntry } from "../index.js";
import type { CommonHeaders } from "./index.js";

export type MonkeyHeader = `// @${string} ${string}` | `// @${string}`;

/**
 * @summary builder for common userscript manager metadata block opening and closing tags
 * @param name optional script name (defaults to UserScript)
 */
export const makeMonkeyTags = (
    name = "UserScript"
): readonly [openTag: string, closeTag: string] => [
    `// ==${name}==`,
    `// ==/${name}==`,
];

/**
 * @summary builder for metadata block header line
 * @param header name-value header entry
 */
export const makeMonkeyHeader = <T extends CommonHeaders>(header: HeaderEntry<T>) => {
    const [name, value,] = header;
    return <MonkeyHeader>(value ? `// @${name} ${value}` : `// @${name}`);
};

/**
 * @summary common postprocessor for header generators
 * @param headers list of name-value header entries
 * @param spaces min number of spaces to separate names from values by
 */
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
