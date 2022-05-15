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
    ViolentmonkeyGrantOptions,
    ViolentmonkeyGrants,
    ViolentmonkeyHeaders
} from "./types.js";

export const generateViolentmonkeyHeaders: HeaderGenerator<ViolentmonkeyGrantOptions> =
    async (
        packageInfo,
        {
            downloadURL,
            homepage,
            spaces,
            matches = [],
            requires = [],
            grants = [],
            inject = "page",
            run = "start",
            pretty = false,
            collapse = false,
            namespace
        }
    ) => {
        const commonHeaders = generateCommonHeaders(packageInfo, { namespace, pretty });

        const grantMap: Record<ViolentmonkeyGrantOptions, ViolentmonkeyGrants> =
            {
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

        const grantHeaders = generateGrantHeaders<
            ViolentmonkeyHeaders,
            ViolentmonkeyGrantOptions
        >(grantMap, grants);

        const matchHeaders = await generateMatchHeaders(matches, scrapeNetworkSites, collapse);

        const requireHeaders = generateRequireHeaders(requires);

        const runAtMap: {
            [P in RunAtOption]?: ViolentmonkeyHeaders["run-at"];
        } = {
            start: "document-start",
            end: "document-end",
            idle: "document-idle",
        };

        const {
            bugs: { url: supportURL } = {},
            repository: { url: sourceURL } = {},
        } = packageInfo;

        const specialHeaders: HeaderEntries<ViolentmonkeyHeaders> = [
            ...generateRunAtHeaders(runAtMap, run),
        ];

        const homepageURL = homepage || packageInfo.homepage || sourceURL;

        if (downloadURL) specialHeaders.push(["downloadURL", downloadURL]);
        if (supportURL) specialHeaders.push(["supportURL", supportURL]);
        if (homepageURL) specialHeaders.push(["homepageURL", homepageURL]);
        if (inject) specialHeaders.push(["inject-into", inject]);

        const headers: HeaderEntries<ViolentmonkeyHeaders> = [
            ...commonHeaders,
            ...grantHeaders,
            ...matchHeaders,
            ...requireHeaders,
            ...specialHeaders,
        ];
        return finalizeMonkeyHeaders(headers, spaces);
    };
