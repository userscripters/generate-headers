"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAuthor = exports.formatAuthor = void 0;
const formatAuthor = ({ name, email, url, }) => name + (email ? ` <${email}>` : "") + (url ? ` (${url})` : "");
exports.formatAuthor = formatAuthor;
const parseAuthor = (info) => {
    if (typeof info === "object")
        return info;
    const authorRegex = /(\w+(?:\s\w+)?)(?:\s<(.+?)>)?(?:\s\((.+?)\))?$/i;
    const match = authorRegex.exec(info);
    if (!match)
        throw new Error(`unable to parse author field: ${info}`);
    const [_full, name, email, url] = match;
    return {
        name,
        email,
        url,
    };
};
exports.parseAuthor = parseAuthor;
