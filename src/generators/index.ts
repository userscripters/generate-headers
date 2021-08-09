import { GeneratorOptions } from "..";
import { RequiredProps } from "../utils/common";
import { PackageInfo } from "../utils/package";
import { GreasemonkeyGrantOptions } from "./greasemonkey/types";
import { TampermonkeyGrantOptions } from "./tampermonkey/types";

declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}

export type CommonGrantOptions = "get" | "set" | "list" | "delete" | "unsafe";

export type GrantOptions =
    | GreasemonkeyGrantOptions
    | TampermonkeyGrantOptions
    | CommonGrantOptions;

export type UserScriptManagerName =
    | "tampermonkey"
    | "violentmonkey"
    | "greasemonkey";

export type CommonGrants = "none" | "unsafeWindow";

export type CommonRunAt = "document-start" | "document-end" | "document-idle";

export type HeaderGenerator<T extends GrantOptions> = (
    info: PackageInfo,
    options: RequiredProps<GeneratorOptions<T>, "spaces">
) => string;

export type CommonHeaders<T extends object = {}> = T & {
    description: string;
    exclude: string[];
    icon: string;
    include: string[];
    match: string[];
    name: string;
    namespace: string;
    noframes: "";
    resource: string[];
    require: string[];
    version: `${number}.${number}.${number}`;
    grant: string;
};

export type CustomHeaders = { contributors: string };

export type HeaderEntry<T> = [keyof T & string, string];

export type HeaderEntries<T> = HeaderEntry<T>[];

/**
 * @summary abstract '@grant' header generator
 */
export const generateGrantHeaders = <
    T extends CommonHeaders,
    U extends GrantOptions
>(
    grantMap: Record<U, T["grant"]>,
    grants: U[]
) => {
    const grantHeaders: HeaderEntries<T> = grants.map((grant) => [
        "grant",
        grantMap[grant],
    ]);

    return grantHeaders.length
        ? grantHeaders
        : ([["grant", "none"]] as HeaderEntries<Pick<T, "grant">>);
};

/**
 * @summary abstract '@match' header generator
 */
export const generateMatchHeaders = <T extends CommonHeaders>(
    matches: string[]
): HeaderEntries<T> => {
    return matches.map((uri) => ["match", uri]);
};
