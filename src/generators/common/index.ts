import { CommonHeaders, HeaderEntries } from "..";
import { formatAuthor, parseAuthor } from "../../utils/author";
import { parseName } from "../../utils/common";
import { PackageInfo } from "../../utils/package";

export const generateCommonHeaders = <T extends CommonHeaders>({
    author,
    description,
    name,
    version,
    icon,
    contributors = [],
}: PackageInfo) => {
    const parsedAuthor = parseAuthor(author);
    const { packageName, scope } = parseName(name);

    const headers: HeaderEntries<T> = [
        ["author", formatAuthor(parsedAuthor)],
        ["description", description],
        ["name", packageName],
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
