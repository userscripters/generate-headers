"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTampermonkeyHeaders = void 0;
const __1 = require("..");
const common_1 = require("../common");
const monkey_1 = require("../common/monkey");
const generateTampermonkeyHeaders = (packageInfo, { spaces, matches = [], grants = [], run = "start" }) => {
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
    const commonHeaders = common_1.generateCommonHeaders(packageInfo);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
        menu: "context-menu",
        body: "document-body",
    };
    const { homepage, bugs: { url: supportURL }, repository: { url: source }, } = packageInfo;
    const specialHeaders = [
        ["homepage", homepage],
        ["supportURL", supportURL],
        ["source", source],
    ];
    const runsAt = runAtMap[run];
    if (runsAt)
        specialHeaders.push(["run-at", runsAt]);
    const headers = [
        ...commonHeaders,
        ...matchHeaders,
        ...grantHeaders,
        ...specialHeaders,
    ];
    return monkey_1.finalizeMonkeyHeaders(headers, spaces);
};
exports.generateTampermonkeyHeaders = generateTampermonkeyHeaders;
