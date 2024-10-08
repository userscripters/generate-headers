export interface NetworkSiteInfo {
    icon: string;
    site: string;
    name: string;
}

interface ApiItems {
    icon_url: string;
    site_url: string;
    name: string;
}

interface ApiResponse {
    items: ApiItems[];
    has_more: boolean;
    backoff?: number;
}

/**
 * @summary scrapes Stack Exchange network site list
 */
export const scrapeNetworkSites = async () => {
    const url = new URL("https://api.stackexchange.com/2.3/sites");
    url.searchParams.set("key", "52HhpSRv*u6t*)tOFwEIHw((");
    url.searchParams.set("pagesize", "100");
    url.searchParams.set("filter", "!SldCuNUOe7I(DQo2T0");

    const siteInfo: NetworkSiteInfo[] = [];

    let hasMore = true;
    let page = 1;
    while (hasMore) {
        url.searchParams.set("page", page.toString());

        const call = await fetch(url);
        const result = await call.json() as ApiResponse;

        const { items, backoff, has_more } = result;

        if (backoff) {
            await new Promise(resolve => setTimeout(resolve, backoff * 1000));
        }

        items
            .forEach(({ icon_url: icon, site_url: site, name }) => {
                siteInfo.push({
                    icon,
                    site: site.replace(/^https?:\/\//, "").replace(/\/$/, ""),
                    name,
                });
            });

        page++;
        hasMore = has_more;
    }

    return siteInfo;
};
