import validator from "validator";
import type { GeneratorOptions, RunAtOption } from "../generate.js";
import { uniquify } from "../utils/common.js";
import type { PackageInfo } from "../utils/package.js";
import type { NetworkSiteInfo } from "../utils/scraper.js";
import type { RequiredProps } from "../utils/types.js";
import { explodePaths } from "../utils/urls.js";
import type { CommonHeaders } from "./common/index.js";
import type { GreasemonkeyGrantOptions } from "./greasemonkey/types.js";
import type { TampermonkeyGrantOptions } from "./tampermonkey/types.js";
import type { ViolentmonkeyGrantOptions } from "./violentmonkey/types.js";

export type GrantOptions =
    | GreasemonkeyGrantOptions
    | TampermonkeyGrantOptions
    | ViolentmonkeyGrantOptions
    | "all";

export type UserScriptManagerName =
    | "tampermonkey"
    | "violentmonkey"
    | "greasemonkey";

export type HeaderGenerator<T extends GrantOptions> = (
    info: PackageInfo,
    options: RequiredProps<GeneratorOptions<T>, "spaces">
) => Promise<string>;

export type HeaderEntry<T> = [keyof T & string, string];

export type HeaderEntries<T> = HeaderEntry<T>[];

/**
 * @summary abstract '@grant' header generator
 */
export const generateGrantHeaders = <
    T extends CommonHeaders,
    U extends GrantOptions,
>(
    grantMap: Record<U, T["grant"]>,
    grants: U[],
) => {
    if (grants.find(g => g === "all")) {
        return Object.entries(grantMap).map(([, v]) => [
            "grant",
            v,
        ]) as HeaderEntries<T>;
    }

    const headers: HeaderEntries<T> = grants.map(g => ["grant", grantMap[g]]);

    return headers.length
        ? headers
        : ([["grant", "none"]] as HeaderEntries<Pick<T, "grant">>);
};

/**
 * @summary abstract '@exclude' header generator
 * @param excludes list of patterns to exclude
 */
export const generateExcludeHeaders = <T extends CommonHeaders>(
    excludes: string[],
): HeaderEntries<T> => {
    return excludes.flatMap(explodePaths).map(uri => ["exclude", uri]);
};

/**
 * @summary abstract '@exclude-match' header generator
 * @param excludes list of patterns to exclude
 */
export const generateExcludeMatchHeaders = <T extends { "exclude-match": string[] }>(
    excludes: string[],
): HeaderEntries<T> => {
    return excludes.flatMap(explodePaths).map(uri => ["exclude-match", uri]);
};

/**
 * @summary abstract '@match' header generator
 */
export const generateMatchHeaders = async <T extends CommonHeaders>(
    matches: string[],
    networkSiteScraper: () => Promise<NetworkSiteInfo[]>,
    collapse = true,
): Promise<HeaderEntries<T>> => {
    if (matches.includes("all")) {
        const match
            = matches.find(m => m.includes("domain")) || "https://domain/*";

        const sites = (await networkSiteScraper())
            // only inclue meta sites if requested
            .filter(({ isMeta }) => matches.includes("meta") || !isMeta);

        const all = sites.map(({ site }) => {
            const domain
                = collapse && site.includes("stackexchange")
                    ? "*.stackexchange.com"
                    : site;
            return match.replace("domain", domain);
        });

        return generateMatchHeaders(uniquify(all), networkSiteScraper);
    }

    return matches.flatMap(explodePaths).map(uri => ["match", uri]);
};

/**
 * @summary abstract '@run-at' header generator
 */
export const generateRunAtHeaders = <T extends { "run-at": string }>(
    runAtMap: { [P in RunAtOption]?: T["run-at"] } & Record<string, unknown>,
    runAt: T["run-at"],
) => {
    const runsAt = runAtMap[runAt];
    return runsAt
        ? ([["run-at", runsAt]] as HeaderEntries<Pick<T, "run-at">>)
        : [];
};

/**
 * @summary abstract '@require' header generator
 */
export const generateRequireHeaders = (
    requires: string[],
): HeaderEntries<{ require: string }> => {
    return requires
        .filter(url => validator.isURL(url, {
            allow_protocol_relative_urls: true,
        }))
        .flatMap(explodePaths)
        .map(url => ["require", url]);
};
