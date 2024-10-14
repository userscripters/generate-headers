import type { PackageInfo, PackagePerson } from "../../utils/package.js";
import type { HeaderEntries } from "../index.js";
export type CommonHeaders<T extends object = {}> = T & {
    author: PackagePerson;
    contributors?: PackagePerson[];
    description: string;
    exclude: string[];
    icon: string;
    include: string[];
    license: string;
    match: string[];
    name: string;
    namespace: string;
    noframes: "";
    resource: string[];
    require: string[];
    version: `${number}.${number}.${number}`;
    grant: string;
};
export type CommonGrantOptions = "get" | "set" | "list" | "delete" | "unsafe";
export type CommonGrants = "none" | "unsafeWindow";
export type CommonRunAt = "document-start" | "document-end" | "document-idle";
export interface CommonGeneratorOptions {
    namespace?: string;
    noframes?: boolean;
    pretty?: boolean;
}
export declare const generateCommonHeaders: (pkg: PackageInfo, options: CommonGeneratorOptions) => HeaderEntries<{
    author: PackagePerson;
    contributors?: PackagePerson[];
    description: string;
    exclude: string[];
    icon: string;
    include: string[];
    license: string;
    match: string[];
    name: string;
    namespace: string;
    noframes: "";
    resource: string[];
    require: string[];
    version: `${number}.${number}.${number}`;
    grant: string;
}>;
