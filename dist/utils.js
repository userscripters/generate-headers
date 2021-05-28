"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAuthor = exports.formatAuthor = exports.mdLink = exports.scase = exports.getLongest = exports.getPackage = void 0;
const promises_1 = require("fs/promises");
const getPackage = async (path) => {
    try {
        const contents = await promises_1.readFile(path, { encoding: "utf-8" });
        return JSON.parse(contents);
    }
    catch (error) {
        return null;
    }
};
exports.getPackage = getPackage;
const getLongest = (words) => Math.max(...words.map(({ length }) => length));
exports.getLongest = getLongest;
const scase = (text) => `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
exports.scase = scase;
const mdLink = (lbl, href) => `[${lbl}](${href})`;
exports.mdLink = mdLink;
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
