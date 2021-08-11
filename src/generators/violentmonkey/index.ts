import {
    generateGrantHeaders,
    generateMatchHeaders,
    HeaderEntries,
    HeaderGenerator,
} from "..";
import { generateCommonHeaders } from "../common";
import { finalizeMonkeyHeaders } from "../common/monkey";
import {
    ViolentmonkeyGrantOptions,
    ViolentmonkeyGrants,
    ViolentmonkeyHeaders,
} from "./types";

export const generateViolentmonkeyHeaders: HeaderGenerator<ViolentmonkeyGrantOptions> =
    (packageInfo, { spaces, matches = [], grants = [], inject = "page" }) => {
        const commonHeaders = generateCommonHeaders(packageInfo);

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

        const matchHeaders = generateMatchHeaders(matches);

        const {
            homepage,
            bugs: { url: supportURL },
        } = packageInfo;
        const specialHeaders: HeaderEntries<ViolentmonkeyHeaders> = [
            ["homepageURL", homepage],
            ["supportURL", supportURL],
        ];

        if (inject) specialHeaders.push(["inject-into", inject]);

        const headers: HeaderEntries<ViolentmonkeyHeaders> = [
            ...commonHeaders,
            ...grantHeaders,
            ...matchHeaders,
            ...specialHeaders,
        ];
        return finalizeMonkeyHeaders(headers, spaces);
    };
