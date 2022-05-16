import type {
    CommonGrantOptions,
    CommonGrants,
    CommonHeaders,
    CommonRunAt
} from "../common/index.js";
import type { CustomHeaders } from "../index.js";

export type ViolentmonkeyGrantOptions =
    | CommonGrantOptions
    | "notify"
    | "clip"
    | "fetch"
    | "download"
    | "style"
    | "close"
    | "focus";

export type ViolentmonkeyGrants =
    | CommonGrants
    | "GM_setValue"
    | "GM_getValue"
    | "GM_listValues"
    | "GM_deleteValue"
    | "window.close"
    | "window.focus"
    | "GM_download"
    | "GM_xmlhttpRequest"
    | "GM_setClipboard"
    | "GM_notification"
    | "GM_addStyle";

export type ViolentmonkeyHeaders = CustomHeaders &
    CommonHeaders<{
        "exclude-match": string[];
        "grant": ViolentmonkeyGrants;
        "run-at": CommonRunAt;
        "noframes": "";
        "inject-into": "page" | "content" | "auto";
        "downloadURL": string;
        "homepageURL": string;
        "supportURL": string;
    }>;
