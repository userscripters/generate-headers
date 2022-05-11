export interface NetworkSiteInfo {
    icon: string;
    site: string;
    name: string;
    description: string;
}
export declare const scrapeNetworkSites: () => Promise<NetworkSiteInfo[]>;
