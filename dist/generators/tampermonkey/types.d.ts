import type { CommonGrantOptions, CommonGrants, CommonHeaders, CommonRunAt, CustomHeaders } from "..";
export declare type TampermonkeyGrantOptions = CommonGrantOptions | "close" | "focus" | "change";
export declare type TampermonkeyGrants = CommonGrants | "GM_setValue" | "GM_getValue" | "GM_listValues" | "GM_deleteValue" | "window.close" | "window.focus" | "window.onurlchange";
export declare type TampermonkeyHeaders = CustomHeaders & CommonHeaders<{
    "homepage": string;
    "homepageURL": string;
    "website": string;
    "source": string;
    "iconURL": string;
    "defaulticon": string;
    "icon64": string;
    "icon64URL": string;
    "updateURL": string;
    "downloadURL": string;
    "supportURL": string;
    "connect": string[];
    "run-at": CommonRunAt | "context-menu" | "document-body";
    "grant": TampermonkeyGrants;
    "antifeature": `${"ads" | "tracking" | "miner"} ${string}`[];
    "unwrap": "";
    "nocompat": "Chrome" | "Opera" | "FireFox";
}>;
