import { getLongest } from "../../utils/common.js";
export const makeMonkeyTags = (name = "UserScript") => [
    `// ==${name}==`,
    `// ==/${name}==`,
];
export const makeMonkeyHeader = (header) => {
    const [name, value] = header;
    return (value ? `// @${name} ${value}` : `// @${name}`);
};
export const finalizeMonkeyHeaders = (headers, spaces) => {
    const [openTag, closeTag] = makeMonkeyTags();
    const longest = getLongest(headers.map(([key]) => key)) + spaces - 1;
    const important = [
        "name",
        "namespace",
        "version",
        "author",
        "contributor",
        "contributors",
    ];
    const primary = important
        .map(name => headers.find(([header]) => header === name))
        .filter(Boolean);
    const secondary = headers.filter(([header]) => !important.includes(header));
    const sortedHeaders = [
        ...primary,
        ...secondary,
    ];
    const indentedHeaders = sortedHeaders.map(([key, val]) => [
        key.padEnd(longest),
        val,
    ]);
    const parsedHeaders = indentedHeaders.map(makeMonkeyHeader);
    return [openTag, ...parsedHeaders, closeTag].join("\n");
};
