import { getLongest } from "../../utils/common.js";
export const makeMonkeyTags = (name = "UserScript") => [
    `// ==${name}==`,
    `// ==/${name}==`,
];
export const makeMonkeyHeader = (header) => {
    const [name, value,] = header;
    return (value ? `// @${name} ${value}` : `// @${name}`);
};
export const finalizeMonkeyHeaders = (headers, spaces) => {
    const [openTag, closeTag] = makeMonkeyTags();
    const longest = getLongest(headers.map(([key]) => key)) + spaces;
    const indentedHeaders = headers.map(([key, val]) => [
        key.padEnd(longest),
        val,
    ]);
    const parsedHeaders = indentedHeaders
        .map(makeMonkeyHeader)
        .sort();
    return [openTag, ...parsedHeaders, closeTag].join("\n");
};
