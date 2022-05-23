import type { RunAtOption } from "../../generate.js";
import { scrapeNetworkSites } from "../../utils/scraper.js";
import { generateCommonHeaders } from "../common/index.js";
import { finalizeMonkeyHeaders } from "../common/monkey.js";
import { generateCustomHeaders } from "../custom.js";
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
    GreasemonkeyGrantOptions,
    GreasemonkeyGrants,
    GreasemonkeyHeaders
} from "./types.js";

/**
 * @see https://wiki.greasespot.net/Metadata_Block
 *
 * @summary generates Greasemonkey metadata block
 * @param packageInfo parsed {@link PackageInfo}
 * @param options generator configuration
 */
export const generateGreasemonkeyHeaders: HeaderGenerator<GreasemonkeyGrantOptions> =
    async (packageInfo, options) => {
        const {
            collapse = false,
            custom = [],
            excludes = [],
            grants = [],
            matches = [],
            namespace,
            noframes = false,
            pretty = false,
            requires = [],
            run = "start",
        } = options;

        const commonHeaders = generateCommonHeaders(packageInfo, { namespace, noframes, pretty });

        const customHeaders = generateCustomHeaders(custom);

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

        const matchHeaders = await generateMatchHeaders(matches, scrapeNetworkSites, collapse);

        const excludeHeaders = generateExcludeHeaders(excludes);

        const requireHeaders = generateRequireHeaders(requires);

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
            ...customHeaders,
            ...excludeHeaders,
            ...grantHeaders,
            ...matchHeaders,
            ...requireHeaders,
            ...specialHeaders,
        ];

        return finalizeMonkeyHeaders(headers, 4);
    };
