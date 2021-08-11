"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGreasemonkeyHeaders = void 0;
const __1 = require("..");
const monkey_1 = require("../common/monkey");
const generateGreasemonkeyHeaders = (_packageInfo, { matches = [], grants = [] }) => {
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
    const matchHeaders = __1.generateMatchHeaders(matches);
    const grantHeaders = __1.generateGrantHeaders(grantMap, grants);
    const headers = [
        ...grantHeaders,
        ...matchHeaders,
    ];
    return monkey_1.finalizeMonkeyHeaders(headers, 4);
};
exports.generateGreasemonkeyHeaders = generateGreasemonkeyHeaders;
