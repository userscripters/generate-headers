"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTampermonkeyHeaders = void 0;
const __1 = require("..");
const common_1 = require("../common");
const monkey_1 = require("../common/monkey");
const generateTampermonkeyHeaders = async (packageInfo, { spaces, whitelist = [], matches = [], grants = [], run = "start", pretty = false, collapse = false, }) => {
    const matchHeaders = await (0, __1.generateMatchHeaders)(matches, collapse);
    const grantMap = {
        set: "GM_setValue",
        get: "GM_getValue",
        delete: "GM_deleteValue",
        list: "GM_listValues",
        fetch: "GM_xmlhttpRequest",
        unsafe: "unsafeWindow",
        change: "window.onurlchange",
        close: "window.close",
        focus: "window.focus",
    };
    const grantHeaders = (0, __1.generateGrantHeaders)(grantMap, grants);
    const commonHeaders = (0, common_1.generateCommonHeaders)(packageInfo, pretty);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
        menu: "context-menu",
        body: "document-body",
    };
    const { homepage, bugs: { url: supportURL } = {}, repository: { url: sourceURL } = {}, } = packageInfo;
    const specialHeaders = [
        ...(0, __1.generateRunAtHeaders)(runAtMap, run),
    ];
    if (supportURL)
        specialHeaders.push(["supportURL", supportURL]);
    if (sourceURL)
        specialHeaders.push(["source", sourceURL]);
    if (homepage)
        specialHeaders.push(["homepage", homepage]);
    if (grants.includes("fetch")) {
        whitelist.forEach((remote) => {
            const schemaStripped = remote.replace(/^.+?:\/\//, "");
            specialHeaders.push(["connect", schemaStripped]);
        });
    }
    const headers = [
        ...commonHeaders,
        ...matchHeaders,
        ...grantHeaders,
        ...specialHeaders,
    ];
    return (0, monkey_1.finalizeMonkeyHeaders)(headers, spaces);
};
exports.generateTampermonkeyHeaders = generateTampermonkeyHeaders;
