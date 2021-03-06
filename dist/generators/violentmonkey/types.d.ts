import type { CommonGrantOptions, CommonGrants, CommonHeaders, CommonRunAt } from "../common/index.js";
import type { CustomHeaders } from "../custom.js";
export declare type ViolentmonkeyGrantOptions = CommonGrantOptions | "notify" | "clip" | "fetch" | "download" | "style" | "close" | "focus";
export declare type ViolentmonkeyGrants = CommonGrants | "GM_setValue" | "GM_getValue" | "GM_listValues" | "GM_deleteValue" | "window.close" | "window.focus" | "GM_download" | "GM_xmlhttpRequest" | "GM_setClipboard" | "GM_notification" | "GM_addStyle";
export declare type ViolentmonkeyHeaders = CustomHeaders & CommonHeaders<{
    "exclude-match": string[];
    "grant": ViolentmonkeyGrants;
    "run-at": CommonRunAt;
    "noframes": "";
    "inject-into": "page" | "content" | "auto";
    "downloadURL": string;
    "homepageURL": string;
    "supportURL": string;
}>;
