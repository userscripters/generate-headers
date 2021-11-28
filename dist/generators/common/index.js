"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommonHeaders = void 0;
const author_1 = require("../../utils/author");
const name_1 = require("../../utils/name");
const generateCommonHeaders = ({ author, description, name, version, icon, contributors = [], }, pretty) => {
    const parsedAuthor = (0, author_1.parseAuthor)(author);
    const { packageName, scope } = (0, name_1.parseName)(name);
    const headers = [
        ["author", (0, author_1.formatAuthor)(parsedAuthor)],
        ["description", description],
        ["name", pretty ? (0, name_1.prettifyName)(packageName) : packageName],
        ["version", version],
    ];
    if (scope)
        headers.push(["namespace", scope]);
    if (icon)
        headers.push(["icon", icon]);
    if (contributors.length) {
        const formatted = contributors.map((contributor) => (0, author_1.formatAuthor)((0, author_1.parseAuthor)(contributor)));
        headers.push(["contributors", formatted.join(", ")]);
    }
    return headers;
};
exports.generateCommonHeaders = generateCommonHeaders;
