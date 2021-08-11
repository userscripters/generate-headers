import { GeneratorOptions, RunAtOption } from "..";
import { RequiredProps } from "../utils/common";
import { PackageInfo, PackagePerson } from "../utils/package";
import { GreasemonkeyGrantOptions } from "./greasemonkey/types";
import { TampermonkeyGrantOptions } from "./tampermonkey/types";
import { ViolentmonkeyGrantOptions } from "./violentmonkey/types";
declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}
export declare type CommonGrantOptions = "get" | "set" | "list" | "delete" | "unsafe";
export declare type GrantOptions = GreasemonkeyGrantOptions | TampermonkeyGrantOptions | ViolentmonkeyGrantOptions;
export declare type UserScriptManagerName = "tampermonkey" | "violentmonkey" | "greasemonkey";
export declare type CommonGrants = "none" | "unsafeWindow";
export declare type CommonRunAt = "document-start" | "document-end" | "document-idle";
export declare type HeaderGenerator<T extends GrantOptions> = (info: PackageInfo, options: RequiredProps<GeneratorOptions<T>, "spaces">) => string;
export declare type CommonHeaders<T extends object = {}> = T & {
    author: PackagePerson;
    contributors?: PackagePerson[];
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
export declare type CustomHeaders = {
    contributors: string;
};
export declare type HeaderEntry<T> = [keyof T & string, string];
export declare type HeaderEntries<T> = HeaderEntry<T>[];
export declare const generateGrantHeaders: <T extends {
    author: PackagePerson;
    contributors?: PackagePerson[] | undefined;
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
export declare const generateMatchHeaders: <T extends {
    author: PackagePerson;
    contributors?: PackagePerson[] | undefined;
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
}>(matches: string[]) => HeaderEntries<T>;
export declare const generateRunAtHeaders: <T extends {
    "run-at": string;
}>(runAtMap: {
    start?: T["run-at"] | undefined;
    end?: T["run-at"] | undefined;
    idle?: T["run-at"] | undefined;
    body?: T["run-at"] | undefined;
    menu?: T["run-at"] | undefined;
} & {
    [x: string]: unknown;
}, runAt: T["run-at"]) => HeaderEntries<Pick<T, "run-at">>;
