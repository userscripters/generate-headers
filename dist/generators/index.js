import validator from "validator";
import { uniqify } from "../utils/common.js";
import { explodePaths } from "../utils/urls.js";
export const generateGrantHeaders = (grantMap, grants) => {
    if (grants.find((g) => g === "all")) {
        return Object.entries(grantMap).map(([, v]) => [
            "grant",
            v,
        ]);
    }
    const headers = grants.map((g) => ["grant", grantMap[g]]);
    return headers.length
        ? headers
        : [["grant", "none"]];
};
export const generateExcludeHeaders = (excludes) => {
    return excludes.flatMap(explodePaths).map((uri) => ["exclude", uri]);
};
export const generateExcludeMatchHeaders = (excludes) => {
    return excludes.flatMap(explodePaths).map((uri) => ["exclude-match", uri]);
};
export const generateMatchHeaders = async (matches, networkSiteScraper, collapse = true) => {
    if (matches.includes("all")) {
        const match = matches.find((m) => /domain/.test(m)) || "https://domain/*";
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
            const domain = collapse && /stackexchange/.test(site)
                ? "*.stackexchange.com"
                : site;
            return match.replace("domain", domain);
        });
        return generateMatchHeaders(uniqify(all), networkSiteScraper);
    }
    return matches.flatMap(explodePaths).map((uri) => ["match", uri]);
};
export const generateRunAtHeaders = (runAtMap, runAt) => {
    const runsAt = runAtMap[runAt];
    return runsAt
        ? [["run-at", runsAt]]
        : [];
};
export const generateRequireHeaders = (requires) => {
    return requires
        .filter((url) => validator.isURL(url, {
        allow_protocol_relative_urls: true
    }))
        .flatMap(explodePaths)
        .map((url) => ["require", url]);
};
