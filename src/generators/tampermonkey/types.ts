import { CommonGrants, CommonHeaders, CommonRunAt, CustomHeaders } from "..";

export type TampermonkeyGrants =
    | CommonGrants
    | "GM_setValue"
    | "GM_getValue"
    | "GM_listValues"
    | "GM_deleteValue"
    | "unsafeWindow"
    | "window.close"
    | "window.focus"
    | "window.onurlchange";

export type TampermonkeyHeaders = CustomHeaders &
    CommonHeaders<{
        "author": string;
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
