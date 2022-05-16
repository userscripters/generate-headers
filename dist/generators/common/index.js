import { formatAuthor, parseAuthor } from "../../utils/author.js";
import { parseName, prettifyName } from "../../utils/name.js";
export const generateCommonHeaders = (pkg, options) => {
    const { namespace, noframes = false, pretty = false } = options;
    const { author, description, name, version, icon, contributors = [], } = pkg;
    const parsedAuthor = parseAuthor(author);
    const { packageName, scope } = parseName(name);
    const headers = [
        ["author", formatAuthor(parsedAuthor)],
        ["description", description],
        ["name", pretty ? prettifyName(packageName) : packageName],
        ["version", version],
    ];
    const scopeOrNs = namespace || scope;
    if (scopeOrNs)
        headers.push(["namespace", scopeOrNs]);
    if (icon)
        headers.push(["icon", icon]);
    if (noframes)
        headers.push(["noframes", ""]);
    if (contributors.length) {
        const formatted = contributors.map((contributor) => formatAuthor(parseAuthor(contributor)));
        headers.push(["contributors", formatted.join(", ")]);
    }
    return headers;
};
