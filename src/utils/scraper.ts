import got from "got";
import { JSDOM } from "jsdom";

got.extend({
    headers: {
        "User-Agent": "Header generator (https://stackapps.com/q/9088/78873)",
    },
});

interface NetworkSiteInfo {
    icon: string;
    site: string;
    name: string;
    description: string;
}

/**
 * @summary scrapes Stack Exchange network site list
 */
export const scrapeNetworkSites = async () => {
    const url = new URL("https://stackexchange.com/sites");

    const response = await got(url, { method: "GET" });

    const { statusCode, body } = response;
    if (statusCode !== 200) return [];

    const {
        window: { document },
    } = new JSDOM(body);

    const siteInfo: NetworkSiteInfo[] = [];

    document
        .querySelectorAll(".gv-item[class*='category-']")
        .forEach((elem) => {
            const img = elem.querySelector<HTMLImageElement>("img.site-icon");
            const name = elem.querySelector(".gv-expanded-site-name");
            const link = elem.closest("a");
            const desc = elem.querySelector(".gv-expanded-site-description");

            if (!desc || !link || !name || !img) return;

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
