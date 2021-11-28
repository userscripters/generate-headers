"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeNetworkSites = void 0;
const got_1 = require("got");
const jsdom_1 = require("jsdom");
got_1.default.extend({
    headers: {
        "User-Agent": "Header generator (https://stackapps.com/q/9088/78873)",
    },
});
const scrapeNetworkSites = async () => {
    const url = new URL("https://stackexchange.com/sites");
    const response = await (0, got_1.default)(url, { method: "GET" });
    const { statusCode, body } = response;
    if (statusCode !== 200)
        return [];
    const { window: { document }, } = new jsdom_1.JSDOM(body);
    const siteInfo = [];
    document
        .querySelectorAll(".gv-item[class*='category-']")
        .forEach((elem) => {
        const img = elem.querySelector("img.site-icon");
        const name = elem.querySelector(".gv-expanded-site-name");
        const link = elem.closest("a");
        const desc = elem.querySelector(".gv-expanded-site-description");
        if (!desc || !link || !name || !img)
            return;
        const { href } = link;
        siteInfo.push({
            icon: img.src,
            site: href.replace(/^https?:\/\//, "").replace(/\/$/, ""),
            name: name.textContent || "",
            description: desc.textContent || "",
        });
    });
    return siteInfo;
};
exports.scrapeNetworkSites = scrapeNetworkSites;
