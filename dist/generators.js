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
const generateTampermonkeyHeaders = ({ author, contributors, icon, name, description, homepage, bugs: { url: supportURL }, repository: { url: source }, version, }) => {
    const [openTag, closeTag] = makeMonkeyTags();
    const parsedAuthor = utils_1.parseAuthor(author);
    const headers = [
        ["author", utils_1.formatAuthor(parsedAuthor)],
        ["description", description],
        ["homepage", homepage],
        ["name", name],
        ["source", source],
        ["supportURL", supportURL],
        ["version", version],
    ];
    if (icon)
        headers.push(["icon", icon]);
    if (contributors) {
        const formatted = contributors.map((contributor) => utils_1.formatAuthor(utils_1.parseAuthor(contributor)));
        headers.push(["contributors", formatted]);
    }
    const parsedHeaders = headers.map(makeMonkeyHeader);
    return `
${openTag}
${parsedHeaders.join("\n")}
${closeTag}
`;
};
exports.generateTampermonkeyHeaders = generateTampermonkeyHeaders;
const generateViolentMonkeyHeaders = ({}) => {
    return "";
};
exports.generateViolentMonkeyHeaders = generateViolentMonkeyHeaders;
