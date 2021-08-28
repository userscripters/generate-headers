"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateViolentmonkeyHeaders = void 0;
const __1 = require("..");
const common_1 = require("../common");
const monkey_1 = require("../common/monkey");
const generateViolentmonkeyHeaders = (packageInfo, { spaces, matches = [], grants = [], inject = "page", run = "start", pretty = false, }) => {
    const commonHeaders = common_1.generateCommonHeaders(packageInfo, pretty);
    const grantMap = {
        set: "GM_setValue",
        get: "GM_getValue",
        list: "GM_listValues",
        delete: "GM_deleteValue",
        download: "GM_download",
        clip: "GM_setClipboard",
        fetch: "GM_xmlhttpRequest",
        notify: "GM_notification",
        style: "GM_addStyle",
        unsafe: "unsafeWindow",
        close: "window.close",
        focus: "window.focus",
    };
    const grantHeaders = __1.generateGrantHeaders(grantMap, grants);
    const matchHeaders = __1.generateMatchHeaders(matches);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
    };
    const { homepage, bugs: { url: supportURL } = {} } = packageInfo;
    const specialHeaders = [
        ...__1.generateRunAtHeaders(runAtMap, run),
    ];
    if (supportURL)
        specialHeaders.push(["supportURL", supportURL]);
    if (homepage)
        specialHeaders.push(["homepageURL", homepage]);
    if (inject)
        specialHeaders.push(["inject-into", inject]);
    const headers = [
        ...commonHeaders,
        ...grantHeaders,
        ...matchHeaders,
        ...specialHeaders,
    ];
    return monkey_1.finalizeMonkeyHeaders(headers, spaces);
};
exports.generateViolentmonkeyHeaders = generateViolentmonkeyHeaders;
