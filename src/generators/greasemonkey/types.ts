import {
    CommonHeaders,
    CommonRunAt,
    CustomHeaders,
    GreasemonkeyGrants,
} from "..";

export type GreasemonkeyHeaders = CustomHeaders &
    CommonHeaders<{
        "grant": GreasemonkeyGrants;
        "run-at": CommonRunAt;
    }>;
