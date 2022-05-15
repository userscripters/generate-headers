import type { RunAtOption } from "../../generate.js";
import { scrapeNetworkSites } from "../../utils/scraper.js";
import { generateCommonHeaders } from "../common/index.js";
import { finalizeMonkeyHeaders } from "../common/monkey.js";
import {
    generateExcludeHeaders,
    generateGrantHeaders,
    generateMatchHeaders,
    generateRequireHeaders,
    generateRunAtHeaders,
    type HeaderEntries,
    type HeaderGenerator
} from "../index.js";
import type {
    TampermonkeyGrantOptions,
    TampermonkeyGrants,
    TampermonkeyHeaders
} from "./types.js";

/**
 * @see https://www.tampermonkey.net/documentation.php
 *
 * @summary generates Tampermonkey metadata block
 * @param packageInfo parsed {@link PackageInfo}
 * @param options generator configuration
 */
export const generateTampermonkeyHeaders: HeaderGenerator<TampermonkeyGrantOptions> =
    async (packageInfo, options) => {
        const {
            collapse = false,
            downloadURL,
            excludes = [],
            grants = [],
            homepage,
            matches = [],
            namespace,
            noframes = false,
            pretty = false,
            requires = [],
            run = "start",
            spaces,
            updateURL,
            whitelist = [],
        } = options;

        const commonHeaders = generateCommonHeaders(packageInfo, { namespace, noframes, pretty });

        const matchHeaders = await generateMatchHeaders(matches, scrapeNetworkSites, collapse);

        const excludeHeaders = generateExcludeHeaders(excludes);

        const requireHeaders = generateRequireHeaders(requires);

        const grantMap: Record<TampermonkeyGrantOptions, TampermonkeyGrants> = {
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

        const grantHeaders = generateGrantHeaders<
            TampermonkeyHeaders,
            TampermonkeyGrantOptions
        >(grantMap, grants);

        const runAtMap: {
            [P in RunAtOption]?: TampermonkeyHeaders["run-at"];
        } = {
            start: "document-start",
            end: "document-end",
            idle: "document-idle",
            menu: "context-menu",
            body: "document-body",
        };

        const {
            bugs: { url: supportURL } = {},
            repository: { url: sourceURL } = {},
        } = packageInfo;

        const specialHeaders: HeaderEntries<TampermonkeyHeaders> = [
            ...generateRunAtHeaders(runAtMap, run),
        ];

        const homepageURL = homepage || packageInfo.homepage || sourceURL;

        if (downloadURL) specialHeaders.push(["downloadURL", downloadURL]);
        if (supportURL) specialHeaders.push(["supportURL", supportURL]);
        if (updateURL) specialHeaders.push(["updateURL", updateURL]);
        if (sourceURL) specialHeaders.push(["source", sourceURL]);
        if (homepageURL) specialHeaders.push(["homepage", homepageURL]);

        if (grants.includes("fetch")) {
            whitelist.forEach((remote) => {
                const schemaStripped = remote.replace(/^.+?:\/\//, "");
                specialHeaders.push(["connect", schemaStripped]);
            });
        }

        const headers = [
            ...commonHeaders,
            ...excludeHeaders,
            ...matchHeaders,
            ...requireHeaders,
            ...grantHeaders,
            ...specialHeaders,
        ];

        //Unused headers:
        // @icon64 and @icon64URL
        // @resource
        // @antifeature
        // @unwrap
        // @nocompat

        return finalizeMonkeyHeaders(headers, spaces);
    };
