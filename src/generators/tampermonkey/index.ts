import type { RunAtOption } from "../../generate.js";
import { scrapeNetworkSites } from "../../utils/scraper.js";
import { generateCommonHeaders } from "../common/index.js";
import { finalizeMonkeyHeaders } from "../common/monkey.js";
import {
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

export const generateTampermonkeyHeaders: HeaderGenerator<TampermonkeyGrantOptions> =
    async (
        packageInfo,
        {
            downloadURL,
            homepage,
            updateURL,
            spaces,
            whitelist = [],
            requires = [],
            matches = [],
            grants = [],
            run = "start",
            pretty = false,
            collapse = false,
            namespace
        }
    ) => {
        const matchHeaders = await generateMatchHeaders(matches, scrapeNetworkSites, collapse);

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

        const commonHeaders = generateCommonHeaders(packageInfo, { namespace, pretty });

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
            ...matchHeaders,
            ...requireHeaders,
            ...grantHeaders,
            ...specialHeaders,
        ];

        //Unused headers:
        // @icon64 and @icon64URL
        // @include
        // @exclude
        // @resource
        // @antifeature
        // @noframes
        // @unwrap
        // @nocompat

        return finalizeMonkeyHeaders(headers, spaces);
    };
