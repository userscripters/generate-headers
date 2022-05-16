import { scrapeNetworkSites } from "../../utils/scraper.js";
import { generateCommonHeaders } from "../common/index.js";
import { finalizeMonkeyHeaders } from "../common/monkey.js";
import { generateExcludeHeaders, generateGrantHeaders, generateMatchHeaders, generateRequireHeaders, generateRunAtHeaders } from "../index.js";
export const generateGreasemonkeyHeaders = async (packageInfo, options) => {
    const { collapse = false, excludes = [], grants = [], matches = [], namespace, noframes = false, pretty = false, requires = [], run = "start", } = options;
    const commonHeaders = generateCommonHeaders(packageInfo, { namespace, noframes, pretty });
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
    const matchHeaders = await generateMatchHeaders(matches, scrapeNetworkSites, collapse);
    const excludeHeaders = generateExcludeHeaders(excludes);
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
        ...excludeHeaders,
        ...grantHeaders,
        ...matchHeaders,
        ...requireHeaders,
        ...specialHeaders,
    ];
    return finalizeMonkeyHeaders(headers, 4);
};
