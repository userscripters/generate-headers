"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGreasemonkeyHeaders = void 0;
const __1 = require("..");
const common_1 = require("../common");
const monkey_1 = require("../common/monkey");
const generateGreasemonkeyHeaders = async (packageInfo, { matches = [], requires = [], grants = [], run = "start", pretty = false, collapse = false, }) => {
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
    const commonHeaders = (0, common_1.generateCommonHeaders)(packageInfo, pretty);
    const matchHeaders = await (0, __1.generateMatchHeaders)(matches, collapse);
    const requireHeaders = (0, __1.generateRequireHeaders)(requires);
    const grantHeaders = (0, __1.generateGrantHeaders)(grantMap, grants);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
    };
    const specialHeaders = [
        ...(0, __1.generateRunAtHeaders)(runAtMap, run),
    ];
    const runsAt = runAtMap[run];
    if (runsAt)
        specialHeaders.push(["run-at", runsAt]);
    const headers = [
        ...commonHeaders,
        ...grantHeaders,
        ...matchHeaders,
        ...requireHeaders,
        ...specialHeaders,
    ];
    return (0, monkey_1.finalizeMonkeyHeaders)(headers, 4);
};
exports.generateGreasemonkeyHeaders = generateGreasemonkeyHeaders;
