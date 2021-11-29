import {
    generateGrantHeaders,
    generateMatchHeaders,
    generateRunAtHeaders,
    HeaderEntries,
    HeaderGenerator,
} from "..";
import { RunAtOption } from "../../generate";
import { generateCommonHeaders } from "../common";
import { finalizeMonkeyHeaders } from "../common/monkey";
import {
    GreasemonkeyGrantOptions,
    GreasemonkeyGrants,
    GreasemonkeyHeaders,
} from "./types";

export const generateGreasemonkeyHeaders: HeaderGenerator<GreasemonkeyGrantOptions> =
    async (
        packageInfo,
        {
            matches = [],
            grants = [],
            run = "start",
            pretty = false,
            collapse = false,
        }
    ) => {
        const grantMap: Record<GreasemonkeyGrantOptions, GreasemonkeyGrants> = {
            set: "GM.setValue",
            get: "GM.getValue",
            delete: "GM.deleteValue",
            list: "GM.listValues",
            notify: "GM.notification",
            clip: "GM.setClipboard",
            fetch: "GM.xmlHttpRequest",
            unsafe: "unsafeWindow",
        };

        const commonHeaders = generateCommonHeaders(packageInfo, pretty);

        const matchHeaders = await generateMatchHeaders(matches, collapse);

        const grantHeaders = generateGrantHeaders<
            GreasemonkeyHeaders,
            GreasemonkeyGrantOptions
        >(grantMap, grants);

        const runAtMap: {
            [P in RunAtOption]?: GreasemonkeyHeaders["run-at"];
        } = {
            start: "document-start",
            end: "document-end",
            idle: "document-idle",
        };

        const specialHeaders: HeaderEntries<GreasemonkeyHeaders> = [
            ...generateRunAtHeaders(runAtMap, run),
        ];

        const runsAt = runAtMap[run];
        if (runsAt) specialHeaders.push(["run-at", runsAt]);

        const headers: HeaderEntries<GreasemonkeyHeaders> = [
            ...commonHeaders,
            ...grantHeaders,
            ...matchHeaders,
            ...specialHeaders,
        ];

        return finalizeMonkeyHeaders(headers, 4);
    };
