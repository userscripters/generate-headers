import {
    generateGrantHeaders,
    GrantOptions,
    HeaderEntries,
    HeaderGenerator,
} from "..";
import { formatAuthor, getLongest, parseAuthor, parseName } from "../../utils";
import {
    makeMonkeyHeader,
    makeMonkeyTags,
    MonkeyHeader,
} from "../common/monkey";
import { TampermonkeyGrants, TampermonkeyHeaders } from "./types";

export const generateTampermonkeyHeaders: HeaderGenerator = (
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
    const [openTag, closeTag] = makeMonkeyTags();

    const parsedAuthor = parseAuthor(author);
    const { packageName, scope } = parseName(name);

    const matchHeaders: HeaderEntries<TampermonkeyHeaders> = matches.map(
        (uri) => ["match", uri]
    );

    const grantMap: Record<GrantOptions, TampermonkeyGrants> = {
        set: "GM_setValue",
        get: "GM_getValue",
        delete: "GM_deleteValue",
        list: "GM_listValues",
        unsafe: "unsafeWindow",
        change: "window.onurlchange",
        close: "window.close",
        focus: "window.focus",
    };

    const grantHeaders = generateGrantHeaders<TampermonkeyHeaders>(
        grantMap,
        grants
    );

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

    const longest = getLongest(headers.map(([key]) => key)) + spaces;

    const indentedHeaders: HeaderEntries<TampermonkeyHeaders> = headers.map(
        ([key, val]) => [key.padEnd(longest), val]
    );

    const parsedHeaders: MonkeyHeader[] = indentedHeaders
        .map(makeMonkeyHeader)
        .sort();

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

    return [openTag, ...parsedHeaders, closeTag].join("\n");
};
