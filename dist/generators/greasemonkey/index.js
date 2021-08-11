"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGreasemonkeyHeaders = void 0;
const __1 = require("..");
const common_1 = require("../common");
const monkey_1 = require("../common/monkey");
const generateGreasemonkeyHeaders = (packageInfo, { matches = [], grants = [], run = "start" }) => {
    const grantMap = {
        set: "GM.setValue",
        get: "GM.getValue",
        delete: "GM.deleteValue",
        list: "GM.listValues",
        notify: "GM.notification",
        clip: "GM.setClipboard",
        fetch: "GM.xmlHttpRequest",
        unsafe: "unsafeWindow",
    };
    const commonHeaders = common_1.generateCommonHeaders(packageInfo);
    const matchHeaders = __1.generateMatchHeaders(matches);
    const grantHeaders = __1.generateGrantHeaders(grantMap, grants);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
    };
    const specialHeaders = [
        ...__1.generateRunAtHeaders(runAtMap, run),
    ];
    const runsAt = runAtMap[run];
    if (runsAt)
        specialHeaders.push(["run-at", runsAt]);
    const headers = [
        ...commonHeaders,
        ...grantHeaders,
        ...matchHeaders,
        ...specialHeaders,
    ];
    return monkey_1.finalizeMonkeyHeaders(headers, 4);
};
exports.generateGreasemonkeyHeaders = generateGreasemonkeyHeaders;
