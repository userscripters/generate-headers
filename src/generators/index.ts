import validator from "validator";
import type { GeneratorOptions, RunAtOption } from "../generate.js";
import { uniqify, type RequiredProps } from "../utils/common.js";
import type { PackageInfo, PackagePerson } from "../utils/package.js";
import { NetworkSiteInfo } from "../utils/scraper.js";
import { explodePaths } from "../utils/urls.js";
import type { GreasemonkeyGrantOptions } from "./greasemonkey/types.js";
import type { TampermonkeyGrantOptions } from "./tampermonkey/types.js";
import type { ViolentmonkeyGrantOptions } from "./violentmonkey/types.js";

declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}

export type CommonGrantOptions = "get" | "set" | "list" | "delete" | "unsafe";

export type GrantOptions =
    | GreasemonkeyGrantOptions
    | TampermonkeyGrantOptions
    | ViolentmonkeyGrantOptions
    | "all";

export type UserScriptManagerName =
    | "tampermonkey"
    | "violentmonkey"
    | "greasemonkey";

export type CommonGrants = "none" | "unsafeWindow";

export type CommonRunAt = "document-start" | "document-end" | "document-idle";

export type HeaderGenerator<T extends GrantOptions> = (
    info: PackageInfo,
    options: RequiredProps<GeneratorOptions<T>, "spaces">
) => Promise<string>;

export type CommonHeaders<T extends object = {}> = T & {
    author: PackagePerson;
    contributors?: PackagePerson[];
    description: string;
    exclude: string[];
    icon: string;
    include: string[];
    match: string[];
    name: string;
    namespace: string;
    noframes: "";
    resource: string[];
    require: string[];
    version: `${number}.${number}.${number}`;
    grant: string;
};

export type CustomHeaders = { contributors: string };

export type HeaderEntry<T> = [keyof T & string, string];

export type HeaderEntries<T> = HeaderEntry<T>[];

/**
 * @summary abstract '@grant' header generator
 */
export const generateGrantHeaders = <
    T extends CommonHeaders,
    U extends GrantOptions
>(
        grantMap: Record<U, T["grant"]>,
        grants: U[]
    ) => {
    if (grants.find((g) => g === "all")) {
        return Object.entries(grantMap).map(([, v]) => [
            "grant",
            v,
        ]) as HeaderEntries<T>;
    }

    const headers: HeaderEntries<T> = grants.map((g) => ["grant", grantMap[g]]);

    return headers.length
        ? headers
        : ([["grant", "none"]] as HeaderEntries<Pick<T, "grant">>);
};

/**
 * @summary abstract '@match' header generator
 */
export const generateMatchHeaders = async <T extends CommonHeaders>(
    matches: string[],
    networkSiteScraper: () => Promise<NetworkSiteInfo[]>,
    collapse = true
): Promise<HeaderEntries<T>> => {
    if (matches.includes("all")) {
        const match =
            matches.find((m) => /domain/.test(m)) || "https://domain/*";

        const sites = await networkSiteScraper();

        if (matches.includes("meta")) {
            const metaSites = sites.flatMap(({ site, ...rest }) => {
                return collapse && /stackexchange/.test(site) || /stackapps/.test(site) ? [] : [{
                    ...rest, site: site.replace(/^(.+?\.(?=.+\.)|)/, "$1meta.")
                }];
            });

            sites.push(...metaSites);
        }

        const all = sites.map(({ site }) => {
            const domain =
                collapse && /stackexchange/.test(site)
                    ? "*.stackexchange.com"
                    : site;
            return match.replace("domain", domain);
        });

        return generateMatchHeaders(uniqify(all), networkSiteScraper);
    }

    return matches.flatMap(explodePaths).map((uri) => ["match", uri]);
};

/**
 * @summary abstract '@run-at' header generator
 */
export const generateRunAtHeaders = <T extends { "run-at": string }>(
    runAtMap: { [P in RunAtOption]?: T["run-at"] } & { [x: string]: unknown },
    runAt: T["run-at"]
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
    requires: string[]
): HeaderEntries<{ require: string; }> => {
    return requires
        .filter((url) => validator.isURL(url, {
            allow_protocol_relative_urls: true
        }))
        .flatMap(explodePaths)
        .map((url) => ["require", url]);
};