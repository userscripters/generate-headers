import type {
    CommonGrantOptions,
    CommonGrants,
    CommonHeaders,
    CommonRunAt,
    CustomHeaders
} from "../index.js";

export type GreasemonkeyGrantOptions =
    | CommonGrantOptions
    | "notify"
    | "clip"
    | "fetch";

/** {@link https://wiki.greasespot.net/@grant} */
export type GreasemonkeyGrants =
    | CommonGrants
    | "GM.setValue"
    | "GM.getValue"
    | "GM.listValues"
    | "GM.deleteValue"
    | "GM.notification"
    | "GM.setClipboard"
    | "GM.xmlHttpRequest";

export type GreasemonkeyHeaders = CustomHeaders &
    CommonHeaders<{
        "grant": GreasemonkeyGrants;
        "run-at": CommonRunAt;
    }>;
