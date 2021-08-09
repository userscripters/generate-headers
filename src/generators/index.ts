import { GeneratorOptions } from "..";
import { RequiredProps } from "../utils/common";
import { PackageInfo } from "../utils/package";

declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}

export type UserScriptManagerName =
    | "tampermonkey"
    | "violentmonkey"
    | "greasemonkey";

export type CommonGrantOptions = "get" | "set" | "list" | "delete" | "unsafe";

export type CommonGrants = "none" | "unsafeWindow";

export type CommonRunAt = "document-start" | "document-end" | "document-idle";

export type HeaderGenerator = (
    info: PackageInfo,
    options: RequiredProps<GeneratorOptions, "spaces">
) => string;

export type GeneratorMap = { [P in UserScriptManagerName]: HeaderGenerator };

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

export type HeaderEntry<T> = [keyof T & string, T[keyof T]];

export type HeaderEntries<T> = HeaderEntry<T>[];

/**
 * @summary abstract header generator
 */
export const generateGrantHeaders = <
    T extends CommonHeaders,
    U extends string = CommonGrantOptions
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
