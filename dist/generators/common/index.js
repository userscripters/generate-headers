"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommonHeaders = void 0;
const author_1 = require("../../utils/author");
const common_1 = require("../../utils/common");
const generateCommonHeaders = ({ author, description, name, version, icon, contributors = [], }) => {
    const parsedAuthor = author_1.parseAuthor(author);
    const { packageName, scope } = common_1.parseName(name);
    const headers = [
        ["author", author_1.formatAuthor(parsedAuthor)],
        ["description", description],
        ["name", packageName],
        ["version", version],
    ];
    if (scope)
        headers.push(["namespace", scope]);
    if (icon)
        headers.push(["icon", icon]);
    if (contributors.length) {
        const formatted = contributors.map((contributor) => author_1.formatAuthor(author_1.parseAuthor(contributor)));
        headers.push(["contributors", formatted.join(", ")]);
    }
    return headers;
};
exports.generateCommonHeaders = generateCommonHeaders;
