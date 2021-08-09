import { generateGrantHeaders, HeaderEntries, HeaderGenerator } from "..";
import { formatAuthor, parseAuthor } from "../../utils/author";
import { parseName } from "../../utils/common";
import { finalizeMonkeyHeaders } from "../common/monkey";
import {
    TampermonkeyGrantOptions,
    TampermonkeyGrants,
    TampermonkeyHeaders,
} from "./types";

export const generateTampermonkeyHeaders: HeaderGenerator<TampermonkeyGrantOptions> =
    (
        {
            author,
            contributors = [],
            icon,
            name,
            description,
            homepage,
            bugs: { url: supportURL },
            repository: { url: source },
            version,
        },
        { spaces, matches = [], grants = [] }
    ) => {
        const parsedAuthor = parseAuthor(author);
        const { packageName, scope } = parseName(name);

        const matchHeaders: HeaderEntries<TampermonkeyHeaders> = matches.map(
            (uri) => ["match", uri]
        );

        const grantMap: Record<TampermonkeyGrantOptions, TampermonkeyGrants> = {
            set: "GM_setValue",
            get: "GM_getValue",
            delete: "GM_deleteValue",
            list: "GM_listValues",
            unsafe: "unsafeWindow",
            change: "window.onurlchange",
            close: "window.close",
            focus: "window.focus",
        };

        const grantHeaders = generateGrantHeaders<
            TampermonkeyHeaders,
            TampermonkeyGrantOptions
        >(grantMap, grants);

        const headers: HeaderEntries<TampermonkeyHeaders> = [
            ["author", formatAuthor(parsedAuthor)],
            ["description", description],
            ["homepage", homepage],
            ...matchHeaders,
            ...grantHeaders,
            ["name", packageName],
            ["source", source],
            ["supportURL", supportURL],
            ["version", version],
        ];

        if (scope) headers.push(["namespace", scope]);

        if (icon) headers.push(["icon", icon]);

        if (contributors.length) {
            const formatted = contributors.map((contributor) =>
                formatAuthor(parseAuthor(contributor))
            );
            headers.push(["contributors", formatted.join(", ")]);
        }

        //Unused headers:
        // @icon64 and @icon64URL
        // @updateURL
        // @downloadURL
        // @include
        // @exclude
        // @require
        // @resource
        // @connect
        // @run-at
        // @antifeature
        // @noframes
        // @unwrap
        // @nocompat

        return finalizeMonkeyHeaders(headers, spaces);
    };
