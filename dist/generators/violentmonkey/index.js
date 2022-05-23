import { scrapeNetworkSites } from "../../utils/scraper.js";
import { generateCommonHeaders } from "../common/index.js";
import { finalizeMonkeyHeaders } from "../common/monkey.js";
import { generateCustomHeaders } from "../custom.js";
import { generateExcludeMatchHeaders, generateGrantHeaders, generateMatchHeaders, generateRequireHeaders, generateRunAtHeaders } from "../index.js";
export const generateViolentmonkeyHeaders = async (packageInfo, options) => {
    const { collapse = false, custom = [], downloadURL, excludes = [], grants = [], homepage, inject = "page", matches = [], namespace, noframes = false, pretty = false, requires = [], run = "start", spaces, } = options;
    const commonHeaders = generateCommonHeaders(packageInfo, { namespace, noframes, pretty });
    const customHeaders = generateCustomHeaders(custom);
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
    const grantHeaders = generateGrantHeaders(grantMap, grants);
    const matchHeaders = await generateMatchHeaders(matches, scrapeNetworkSites, collapse);
    const excludeHeaders = generateExcludeMatchHeaders(excludes);
    const requireHeaders = generateRequireHeaders(requires);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
    };
    const { bugs: { url: supportURL } = {}, repository: { url: sourceURL } = {}, } = packageInfo;
    const specialHeaders = [
        ...generateRunAtHeaders(runAtMap, run),
    ];
    const homepageURL = homepage || packageInfo.homepage || sourceURL;
    if (downloadURL)
        specialHeaders.push(["downloadURL", downloadURL]);
    if (inject)
        specialHeaders.push(["inject-into", inject]);
    if (homepageURL)
        specialHeaders.push(["homepageURL", homepageURL]);
    if (supportURL)
        specialHeaders.push(["supportURL", supportURL]);
    const headers = [
        ...commonHeaders,
        ...customHeaders,
        ...excludeHeaders,
        ...grantHeaders,
        ...matchHeaders,
        ...requireHeaders,
        ...specialHeaders,
    ];
    return finalizeMonkeyHeaders(headers, spaces);
};
