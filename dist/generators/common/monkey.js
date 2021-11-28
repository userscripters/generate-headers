"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeMonkeyHeaders = exports.makeMonkeyHeader = exports.makeMonkeyTags = void 0;
const common_1 = require("../../utils/common");
const makeMonkeyTags = (name = "UserScript") => [
    `// ==${name}==`,
    `// ==/${name}==`,
];
exports.makeMonkeyTags = makeMonkeyTags;
const makeMonkeyHeader = ([name, value,]) => (value ? `// @${name} ${value}` : `// @${name}`);
exports.makeMonkeyHeader = makeMonkeyHeader;
const finalizeMonkeyHeaders = (headers, spaces) => {
    const [openTag, closeTag] = (0, exports.makeMonkeyTags)();
    const longest = (0, common_1.getLongest)(headers.map(([key]) => key)) + spaces;
    const indentedHeaders = headers.map(([key, val]) => [
        key.padEnd(longest),
        val,
    ]);
    const parsedHeaders = indentedHeaders
        .map(exports.makeMonkeyHeader)
        .sort();
    return [openTag, ...parsedHeaders, closeTag].join("\n");
};
exports.finalizeMonkeyHeaders = finalizeMonkeyHeaders;
