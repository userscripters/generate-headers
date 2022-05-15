import { scrapeNetworkSites } from "../../utils/scraper.js";
import { generateCommonHeaders } from "../common/index.js";
import { finalizeMonkeyHeaders } from "../common/monkey.js";
import { generateExcludeMatchHeaders, generateGrantHeaders, generateMatchHeaders, generateRequireHeaders, generateRunAtHeaders } from "../index.js";
export const generateViolentmonkeyHeaders = async (packageInfo, { downloadURL, excludes = [], homepage, spaces, matches = [], requires = [], grants = [], inject = "page", run = "start", pretty = false, collapse = false, namespace }) => {
    const commonHeaders = generateCommonHeaders(packageInfo, { namespace, pretty });
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
    if (supportURL)
        specialHeaders.push(["supportURL", supportURL]);
    if (homepageURL)
        specialHeaders.push(["homepageURL", homepageURL]);
    if (inject)
        specialHeaders.push(["inject-into", inject]);
    const headers = [
        ...commonHeaders,
        ...excludeHeaders,
        ...grantHeaders,
        ...matchHeaders,
        ...requireHeaders,
        ...specialHeaders,
    ];
    return finalizeMonkeyHeaders(headers, spaces);
};
