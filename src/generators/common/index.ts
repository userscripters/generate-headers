import { formatAuthor, parseAuthor } from "../../utils/author.js";
import { parseName, prettifyName } from "../../utils/name.js";
import type { PackageInfo } from "../../utils/package.js";
import type { CommonHeaders, HeaderEntries } from "../index.js";

export const generateCommonHeaders = (
    {
        author,
        description,
        name,
        version,
        icon,
        contributors = [],
    }: PackageInfo,
    pretty: boolean
) => {
    const parsedAuthor = parseAuthor(author);
    const { packageName, scope } = parseName(name);

    const headers: HeaderEntries<CommonHeaders> = [
        ["author", formatAuthor(parsedAuthor)],
        ["description", description],
        ["name", pretty ? prettifyName(packageName) : packageName],
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

    return headers;
};
