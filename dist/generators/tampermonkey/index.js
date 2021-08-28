"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTampermonkeyHeaders = void 0;
const __1 = require("..");
const common_1 = require("../common");
const monkey_1 = require("../common/monkey");
const generateTampermonkeyHeaders = (packageInfo, { spaces, matches = [], grants = [], run = "start", pretty = false }) => {
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
    const commonHeaders = common_1.generateCommonHeaders(packageInfo, pretty);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
        menu: "context-menu",
        body: "document-body",
    };
    const { homepage, bugs: { url: supportURL } = {}, repository: { url: sourceURL } = {}, } = packageInfo;
    const specialHeaders = [
        ...__1.generateRunAtHeaders(runAtMap, run),
    ];
    if (supportURL)
        specialHeaders.push(["supportURL", supportURL]);
    if (sourceURL)
        specialHeaders.push(["source", sourceURL]);
    if (homepage)
        specialHeaders.push(["homepage", homepage]);
    const headers = [
        ...commonHeaders,
        ...matchHeaders,
        ...grantHeaders,
        ...specialHeaders,
    ];
    return monkey_1.finalizeMonkeyHeaders(headers, spaces);
};
exports.generateTampermonkeyHeaders = generateTampermonkeyHeaders;
