import { scrapeNetworkSites } from "../../utils/scraper.js";
import { generateCommonHeaders } from "../common/index.js";
import { finalizeMonkeyHeaders } from "../common/monkey.js";
import { generateGrantHeaders, generateMatchHeaders, generateRequireHeaders, generateRunAtHeaders } from "../index.js";
export const generateGreasemonkeyHeaders = async (packageInfo, { matches = [], requires = [], grants = [], run = "start", pretty = false, collapse = false, namespace }) => {
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
    const commonHeaders = generateCommonHeaders(packageInfo, { namespace, pretty });
    const matchHeaders = await generateMatchHeaders(matches, scrapeNetworkSites, collapse);
    const requireHeaders = generateRequireHeaders(requires);
    const grantHeaders = generateGrantHeaders(grantMap, grants);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
    };
    const specialHeaders = [
        ...generateRunAtHeaders(runAtMap, run),
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
    return finalizeMonkeyHeaders(headers, 4);
};
