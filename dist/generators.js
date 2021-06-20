"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateViolentMonkeyHeaders = exports.generateTampermonkeyHeaders = exports.generateGreasemnonkeyHeaders = void 0;
const utils_1 = require("./utils");
const makeMonkeyTags = (name = "UserScript") => [
    `// ==${name}==`,
    `// ==/${name}==`,
];
const makeMonkeyHeader = ([name, value]) => (value ? `// @${name} ${value}` : `// @${name}`);
const generateGreasemnonkeyHeaders = () => {
    const [openTag, closeTag] = makeMonkeyTags();
    const headers = [];
    const parsedHeaders = headers.map(makeMonkeyHeader);
    return `
${openTag}
${parsedHeaders.join("\n")}
${closeTag}
`;
};
exports.generateGreasemnonkeyHeaders = generateGreasemnonkeyHeaders;
const LN = "\n";
const generateTampermonkeyHeaders = ({ author, contributors, icon, name, description, homepage, bugs: { url: supportURL }, repository: { url: source }, version, }, { spaces, matches = [] }) => {
    const [openTag, closeTag] = makeMonkeyTags();
    const parsedAuthor = utils_1.parseAuthor(author);
    const { packageName, scope } = utils_1.parseName(name);
    const matchHeaders = matches.map((uri) => ["match", uri]);
    const headers = [
        ["author", utils_1.formatAuthor(parsedAuthor)],
        ["description", description],
        ["homepage", homepage],
        ...matchHeaders,
        ["name", packageName],
        ["source", source],
        ["supportURL", supportURL],
        ["version", version],
    ];
    if (scope)
        headers.push(["namespace", scope]);
    if (icon)
        headers.push(["icon", icon]);
    if (contributors && contributors.length) {
        const formatted = contributors.map((contributor) => utils_1.formatAuthor(utils_1.parseAuthor(contributor)));
        headers.push(["contributors", formatted]);
    }
    const longest = utils_1.getLongest(headers.map(([key]) => key)) + spaces;
    const indentedHeaders = headers.map(([key, val]) => [key.padEnd(longest), val]);
    const parsedHeaders = indentedHeaders
        .map(makeMonkeyHeader)
        .sort();
    return [openTag, ...parsedHeaders, closeTag].join(LN);
};
exports.generateTampermonkeyHeaders = generateTampermonkeyHeaders;
const generateViolentMonkeyHeaders = ({}) => {
    return "";
};
exports.generateViolentMonkeyHeaders = generateViolentMonkeyHeaders;
