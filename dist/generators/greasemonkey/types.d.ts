import type { CommonGrantOptions, CommonGrants, CommonHeaders, CommonRunAt, CustomHeaders } from "..";
export declare type GreasemonkeyGrantOptions = CommonGrantOptions | "notify" | "clip" | "fetch";
export declare type GreasemonkeyGrants = CommonGrants | "GM.setValue" | "GM.getValue" | "GM.listValues" | "GM.deleteValue" | "GM.notification" | "GM.setClipboard" | "GM.xmlHttpRequest";
export declare type GreasemonkeyHeaders = CustomHeaders & CommonHeaders<{
    "grant": GreasemonkeyGrants;
    "run-at": CommonRunAt;
}>;
