import { scrapeNetworkSites } from "../../utils/scraper.js";
import { generateCommonHeaders } from "../common/index.js";
import { finalizeMonkeyHeaders } from "../common/monkey.js";
import { generateCustomHeaders } from "../custom.js";
import { generateExcludeHeaders, generateGrantHeaders, generateMatchHeaders, generateRequireHeaders, generateRunAtHeaders } from "../index.js";
export const generateTampermonkeyHeaders = async (packageInfo, options) => {
    const { collapse = false, custom = [], downloadURL, excludes = [], grants = [], homepage, matches = [], namespace, noframes = false, pretty = false, requires = [], run = "start", spaces, updateURL, whitelist = [], } = options;
    const commonHeaders = generateCommonHeaders(packageInfo, { namespace, noframes, pretty });
    const customHeaders = generateCustomHeaders(custom);
    const matchHeaders = await generateMatchHeaders(matches, scrapeNetworkSites, collapse);
    const excludeHeaders = generateExcludeHeaders(excludes);
    const requireHeaders = generateRequireHeaders(requires);
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
    const grantHeaders = generateGrantHeaders(grantMap, grants);
    const runAtMap = {
        start: "document-start",
        end: "document-end",
        idle: "document-idle",
        menu: "context-menu",
        body: "document-body",
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
    if (updateURL)
        specialHeaders.push(["updateURL", updateURL]);
    if (sourceURL)
        specialHeaders.push(["source", sourceURL]);
    if (homepageURL)
        specialHeaders.push(["homepage", homepageURL]);
    if (grants.includes("fetch")) {
        whitelist.forEach((remote) => {
            const schemaStripped = remote.replace(/^.+?:\/\//, "");
            specialHeaders.push(["connect", schemaStripped]);
        });
    }
    const headers = [
        ...commonHeaders,
        ...customHeaders,
        ...excludeHeaders,
        ...matchHeaders,
        ...requireHeaders,
        ...grantHeaders,
        ...specialHeaders,
    ];
    return finalizeMonkeyHeaders(headers, spaces);
};
