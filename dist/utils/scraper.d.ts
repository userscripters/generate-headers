export interface NetworkSiteInfo {
    icon: string;
    site: string;
    name: string;
    isMeta: boolean;
}
export declare const scrapeNetworkSites: () => Promise<NetworkSiteInfo[]>;
