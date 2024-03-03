export type NetworkSiteInfo = {
    icon: string;
    site: string;
    name: string;
};
export declare const scrapeNetworkSites: () => Promise<NetworkSiteInfo[]>;
