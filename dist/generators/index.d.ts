/// <reference types="node" />
import type { GeneratorOptions, RunAtOption } from "../generate.js";
import type { PackageInfo } from "../utils/package.js";
import type { NetworkSiteInfo } from "../utils/scraper.js";
import type { RequiredProps } from "../utils/types.js";
import type { GreasemonkeyGrantOptions } from "./greasemonkey/types.js";
import type { TampermonkeyGrantOptions } from "./tampermonkey/types.js";
import type { ViolentmonkeyGrantOptions } from "./violentmonkey/types.js";
declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}
export declare type GrantOptions = GreasemonkeyGrantOptions | TampermonkeyGrantOptions | ViolentmonkeyGrantOptions | "all";
export declare type UserScriptManagerName = "tampermonkey" | "violentmonkey" | "greasemonkey";
export declare type HeaderGenerator<T extends GrantOptions> = (info: PackageInfo, options: RequiredProps<GeneratorOptions<T>, "spaces">) => Promise<string>;
export declare type HeaderEntry<T> = [keyof T & string, string];
export declare type HeaderEntries<T> = HeaderEntry<T>[];
export declare const generateGrantHeaders: <T extends {
    author: import("../utils/package.js").PackagePerson;
    contributors?: import("../utils/package.js").PackagePerson[] | undefined;
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
}, U extends GrantOptions>(grantMap: Record<U, T["grant"]>, grants: U[]) => HeaderEntries<T>;
export declare const generateExcludeHeaders: <T extends {
    author: import("../utils/package.js").PackagePerson;
    contributors?: import("../utils/package.js").PackagePerson[] | undefined;
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
}>(excludes: string[]) => HeaderEntries<T>;
export declare const generateExcludeMatchHeaders: <T extends {
    "exclude-match": string[];
}>(excludes: string[]) => HeaderEntries<T>;
export declare const generateMatchHeaders: <T extends {
    author: import("../utils/package.js").PackagePerson;
    contributors?: import("../utils/package.js").PackagePerson[] | undefined;
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
}>(matches: string[], networkSiteScraper: () => Promise<NetworkSiteInfo[]>, collapse?: boolean) => Promise<HeaderEntries<T>>;
export declare const generateRunAtHeaders: <T extends {
    "run-at": string;
}>(runAtMap: {
    body?: T["run-at"] | undefined;
    menu?: T["run-at"] | undefined;
    start?: T["run-at"] | undefined;
    end?: T["run-at"] | undefined;
    idle?: T["run-at"] | undefined;
} & {
    [x: string]: unknown;
}, runAt: T["run-at"]) => HeaderEntries<Pick<T, "run-at">>;
export declare const generateRequireHeaders: (requires: string[]) => HeaderEntries<{
    require: string;
}>;
