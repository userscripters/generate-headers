import {
    generateGrantHeaders,
    generateMatchHeaders,
    HeaderEntries,
    HeaderGenerator,
} from "..";
import { finalizeMonkeyHeaders } from "../common/monkey";
import {
    GreasemonkeyGrantOptions,
    GreasemonkeyGrants,
    GreasemonkeyHeaders,
} from "./types";

//TODO: finish creating the processor
export const generateGreasemonkeyHeaders: HeaderGenerator<GreasemonkeyGrantOptions> =
    (_packageInfo, { matches = [], grants = [] }) => {
        const grantMap: Record<GreasemonkeyGrantOptions, GreasemonkeyGrants> = {
            set: "GM.setValue",
            get: "GM.getValue",
            delete: "GM.deleteValue",
            list: "GM.listValues",
            notify: "GM.notification",
            clip: "GM.setClipboard",
            fetch: "GM.xmlHttpRequest",
            unsafe: "unsafeWindow",
        };

        const matchHeaders = generateMatchHeaders(matches);

        const grantHeaders = generateGrantHeaders<
            GreasemonkeyHeaders,
            GreasemonkeyGrantOptions
        >(grantMap, grants);

        const headers: HeaderEntries<GreasemonkeyHeaders> = [
            ...grantHeaders,
            ...matchHeaders,
        ];

        return finalizeMonkeyHeaders(headers, 4);
    };
