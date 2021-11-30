import {
    generateGrantHeaders,
    generateMatchHeaders,
    generateRunAtHeaders,
    type HeaderEntries,
    type HeaderGenerator
} from "..";
import type { RunAtOption } from "../../generate";
import { generateCommonHeaders } from "../common";
import { finalizeMonkeyHeaders } from "../common/monkey";
import type {
    ViolentmonkeyGrantOptions,
    ViolentmonkeyGrants,
    ViolentmonkeyHeaders
} from "./types";

export const generateViolentmonkeyHeaders: HeaderGenerator<ViolentmonkeyGrantOptions> =
    async (
        packageInfo,
        {
            spaces,
            matches = [],
            grants = [],
            inject = "page",
            run = "start",
            pretty = false,
            collapse = false,
        }
    ) => {
        const commonHeaders = generateCommonHeaders(packageInfo, pretty);

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

        const matchHeaders = await generateMatchHeaders(matches, collapse);

        const runAtMap: {
            [P in RunAtOption]?: ViolentmonkeyHeaders["run-at"];
        } = {
            start: "document-start",
            end: "document-end",
            idle: "document-idle",
        };

        const { homepage, bugs: { url: supportURL } = {} } = packageInfo;
        const specialHeaders: HeaderEntries<ViolentmonkeyHeaders> = [
            ...generateRunAtHeaders(runAtMap, run),
        ];

        if (supportURL) specialHeaders.push(["supportURL", supportURL]);
        if (homepage) specialHeaders.push(["homepageURL", homepage]);
        if (inject) specialHeaders.push(["inject-into", inject]);

        const headers: HeaderEntries<ViolentmonkeyHeaders> = [
            ...commonHeaders,
            ...grantHeaders,
            ...matchHeaders,
            ...specialHeaders,
        ];
        return finalizeMonkeyHeaders(headers, spaces);
    };
