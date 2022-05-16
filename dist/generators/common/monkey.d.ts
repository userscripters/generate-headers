import type { HeaderEntries, HeaderEntry } from "../index.js";
export declare type MonkeyHeader = `// @${string} ${string}` | `// @${string}`;
export declare const makeMonkeyTags: (name?: string) => readonly [openTag: string, closeTag: string];
export declare const makeMonkeyHeader: <T extends {
    author: import("../../utils/package.js").PackagePerson;
    contributors?: import("../../utils/package.js").PackagePerson[] | undefined;
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
}>(header: HeaderEntry<T>) => MonkeyHeader;
export declare const finalizeMonkeyHeaders: <T extends {
    author: import("../../utils/package.js").PackagePerson;
    contributors?: import("../../utils/package.js").PackagePerson[] | undefined;
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
}>(headers: HeaderEntries<T>, spaces: number) => string;
