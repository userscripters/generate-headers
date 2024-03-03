export const scrapeNetworkSites = async () => {
    const url = new URL("https://api.stackexchange.com/2.3/sites");
    url.searchParams.set("key", "52HhpSRv*u6t*)tOFwEIHw((");
    url.searchParams.set("pagesize", "100");
    url.searchParams.set("filter", "!SldCuNUOe7I(DQo2T0");
    const siteInfo = [];
    let hasMore = true;
    let page = 1;
    while (hasMore) {
        url.searchParams.set("page", page.toString());
        const call = await fetch(url);
        const result = await call.json();
        const { items, backoff, has_more } = result;
        if (backoff) {
            await new Promise((resolve) => setTimeout(resolve, backoff * 1000));
        }
        items
            .forEach(({ icon_url: icon, site_url: site, name }) => {
            siteInfo.push({
                icon,
                site: site.replace(/^https?:\/\//, "").replace(/\/$/, ""),
                name
            });
        });
        page++;
        hasMore = has_more;
    }
    return siteInfo;
};
