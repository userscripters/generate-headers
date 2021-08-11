import {
    generateGrantHeaders,
    generateMatchHeaders,
    generateRunAtHeaders,
    HeaderEntries,
    HeaderGenerator,
} from "..";
import { RunAtOption } from "../..";
import { generateCommonHeaders } from "../common";
import { finalizeMonkeyHeaders } from "../common/monkey";
import {
    TampermonkeyGrantOptions,
    TampermonkeyGrants,
    TampermonkeyHeaders,
} from "./types";

export const generateTampermonkeyHeaders: HeaderGenerator<TampermonkeyGrantOptions> =
    (packageInfo, { spaces, matches = [], grants = [], run = "start" }) => {
        const matchHeaders = generateMatchHeaders(matches);

        const grantMap: Record<TampermonkeyGrantOptions, TampermonkeyGrants> = {
            set: "GM_setValue",
            get: "GM_getValue",
            delete: "GM_deleteValue",
            list: "GM_listValues",
            unsafe: "unsafeWindow",
            change: "window.onurlchange",
            close: "window.close",
            focus: "window.focus",
        };

        const grantHeaders = generateGrantHeaders<
            TampermonkeyHeaders,
            TampermonkeyGrantOptions
        >(grantMap, grants);

        const commonHeaders = generateCommonHeaders(packageInfo);

        const runAtMap: {
            [P in RunAtOption]?: TampermonkeyHeaders["run-at"];
        } = {
            start: "document-start",
            end: "document-end",
            idle: "document-idle",
            menu: "context-menu",
            body: "document-body",
        };

        const {
            homepage,
            bugs: { url: supportURL },
            repository: { url: source },
        } = packageInfo;
        const specialHeaders: HeaderEntries<TampermonkeyHeaders> = [
            ["homepage", homepage],
            ["supportURL", supportURL],
            ["source", source],
            ...generateRunAtHeaders(runAtMap, run),
        ];

        const headers = [
            ...commonHeaders,
            ...matchHeaders,
            ...grantHeaders,
            ...specialHeaders,
        ];

        //Unused headers:
        // @icon64 and @icon64URL
        // @updateURL
        // @downloadURL
        // @include
        // @exclude
        // @require
        // @resource
        // @connect
        // @antifeature
        // @noframes
        // @unwrap
        // @nocompat

        return finalizeMonkeyHeaders(headers, spaces);
    };
