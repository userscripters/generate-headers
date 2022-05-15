import { formatAuthor, parseAuthor } from "../../utils/author.js";
import { parseName, prettifyName } from "../../utils/name.js";
import type { PackageInfo } from "../../utils/package.js";
import type { CommonHeaders, HeaderEntries } from "../index.js";

export type CommonGeneratorOptions = {
    namespace?: string;
    noframes?: boolean;
    pretty?: boolean;
}

/**
 * @summary generates headers common to all userscript managers
 * @param pkg parsed package.json
 * @param options configuration options
 */
export const generateCommonHeaders = (
    pkg: PackageInfo,
    options: CommonGeneratorOptions
) => {
    const {
        namespace,
        noframes = false,
        pretty = false
    } = options;

    const {
        author,
        description,
        name,
        version,
        icon,
        contributors = [],
    } = pkg;

    const parsedAuthor = parseAuthor(author);
    const { packageName, scope } = parseName(name);

    const headers: HeaderEntries<CommonHeaders> = [
        ["author", formatAuthor(parsedAuthor)],
        ["description", description],
        ["name", pretty ? prettifyName(packageName) : packageName],
        ["version", version],
    ];

    const scopeOrNs = namespace || scope;
    if (scopeOrNs) headers.push(["namespace", scopeOrNs]);

    if (icon) headers.push(["icon", icon]);
    if (noframes) headers.push(["noframes", ""]);

    if (contributors.length) {
        const formatted = contributors.map((contributor) =>
            formatAuthor(parseAuthor(contributor))
        );
        headers.push(["contributors", formatted.join(", ")]);
    }

    return headers;
};
