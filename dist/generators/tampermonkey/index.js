"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTampermonkeyHeaders = void 0;
const __1 = require("..");
const author_1 = require("../../utils/author");
const common_1 = require("../../utils/common");
const monkey_1 = require("../common/monkey");
const generateTampermonkeyHeaders = ({ author, contributors = [], icon, name, description, homepage, bugs: { url: supportURL }, repository: { url: source }, version, }, { spaces, matches = [], grants = [] }) => {
    const parsedAuthor = author_1.parseAuthor(author);
    const { packageName, scope } = common_1.parseName(name);
    const matchHeaders = __1.generateMatchHeaders(matches);
    const grantMap = {
        set: "GM_setValue",
        get: "GM_getValue",
        delete: "GM_deleteValue",
        list: "GM_listValues",
        unsafe: "unsafeWindow",
        change: "window.onurlchange",
        close: "window.close",
        focus: "window.focus",
    };
    const grantHeaders = __1.generateGrantHeaders(grantMap, grants);
    const headers = [
        ["author", author_1.formatAuthor(parsedAuthor)],
        ["description", description],
        ["homepage", homepage],
        ...matchHeaders,
        ...grantHeaders,
        ["name", packageName],
        ["source", source],
        ["supportURL", supportURL],
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
    return monkey_1.finalizeMonkeyHeaders(headers, spaces);
};
exports.generateTampermonkeyHeaders = generateTampermonkeyHeaders;
