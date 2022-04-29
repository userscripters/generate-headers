"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRequireHeaders = exports.generateRunAtHeaders = exports.generateMatchHeaders = exports.generateGrantHeaders = void 0;
const validator_1 = __importDefault(require("validator"));
const common_1 = require("../utils/common");
const scraper_1 = require("../utils/scraper");
const urls_1 = require("../utils/urls");
const generateGrantHeaders = (grantMap, grants) => {
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
exports.generateGrantHeaders = generateGrantHeaders;
const generateMatchHeaders = async (matches, collapse = true) => {
    if (matches.includes("all")) {
        const match = matches.find((m) => /domain/.test(m)) || "https://domain/*";
        const sites = await (0, scraper_1.scrapeNetworkSites)();
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
        return (0, exports.generateMatchHeaders)((0, common_1.uniqify)(all));
    }
    return matches.flatMap(urls_1.explodePaths).map((uri) => ["match", uri]);
};
exports.generateMatchHeaders = generateMatchHeaders;
const generateRunAtHeaders = (runAtMap, runAt) => {
    const runsAt = runAtMap[runAt];
    return runsAt
        ? [["run-at", runsAt]]
        : [];
};
exports.generateRunAtHeaders = generateRunAtHeaders;
const generateRequireHeaders = (requires) => {
    return requires
        .filter((url) => validator_1.default.isURL(url, {
        allow_protocol_relative_urls: true
    }))
        .flatMap(urls_1.explodePaths)
        .map((url) => ["require", url]);
};
exports.generateRequireHeaders = generateRequireHeaders;
