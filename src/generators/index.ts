import { GeneratorOptions } from "..";
import { PackageInfo, RequiredProps } from "../utils";

declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}

export type UserScriptManagerName =
    | "tampermonkey"
    | "violentmonkey"
    | "greasemonkey";

export type GrantOptions =
    | "get"
    | "set"
    | "list"
    | "delete"
    | "unsafe"
    | "close"
    | "focus"
    | "change";

export type CommonGrants = "none";

export type CommonRunAt = "document-start" | "document-end" | "document-idle";

/** {@link https://wiki.greasespot.net/@grant} */
export type GreasemonkeyGrants =
    | CommonGrants
    | "GM.setValue"
    | "GM.getValue"
    | "GM.listValues"
    | "GM.deleteValue";

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
export const generateGrantHeaders = <T extends CommonHeaders>(
    grantMap: Record<GrantOptions, T["grant"]>,
    grants: GrantOptions[]
) => {
    const grantHeaders: HeaderEntries<T> = grants.map((grant) => [
        "grant",
        grantMap[grant],
    ]);

    return grantHeaders.length
        ? grantHeaders
        : ([["grant", "none"]] as HeaderEntries<Pick<T, "grant">>);
};
