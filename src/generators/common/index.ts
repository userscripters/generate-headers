import { formatAuthor, parseAuthor } from "../../utils/author.js";
import { parseName, prettifyName } from "../../utils/name.js";
import type { PackageInfo, PackagePerson } from "../../utils/package.js";
import type { HeaderEntries } from "../index.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CommonHeaders<T extends object = {}> = T & {
    author: PackagePerson;
    contributors?: PackagePerson[];
    description: string;
    exclude: string[];
    icon: string;
    include: string[];
    license: string;
    match: string[];
    name: string;
    namespace: string;
    noframes: "";
    resource: string[];
    require: string[];
    version: `${number}.${number}.${number}`;
    grant: string;
};

export type CommonGrantOptions = "get" | "set" | "list" | "delete" | "unsafe";

export type CommonGrants = "none" | "unsafeWindow";

export type CommonRunAt = "document-start" | "document-end" | "document-idle";

export interface CommonGeneratorOptions {
    namespace?: string;
    noframes?: boolean;
    pretty?: boolean;
};

/**
 * @summary generates headers common to all userscript managers
 * @param pkg parsed package.json
 * @param options configuration options
 */
export const generateCommonHeaders = (
    pkg: PackageInfo,
    options: CommonGeneratorOptions,
) => {
    const {
        namespace,
        noframes = false,
        pretty = false,
    } = options;

    const {
        author,
        description,
        name,
        version,
        icon,
        contributors = [],
        license,
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

    if (license) headers.push(["license", license]);
    if (icon) headers.push(["icon", icon]);
    if (noframes) headers.push(["noframes", ""]);

    if (contributors.length) {
        const formatted = contributors.map(contributor =>
            formatAuthor(parseAuthor(contributor)),
        );
        headers.push(["contributors", formatted.join(", ")]);
    }

    return headers;
};
