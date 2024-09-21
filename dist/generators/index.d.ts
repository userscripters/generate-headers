import type { GeneratorOptions, RunAtOption } from "../generate.js";
import type { PackageInfo } from "../utils/package.js";
import type { NetworkSiteInfo } from "../utils/scraper.js";
import type { RequiredProps } from "../utils/types.js";
import type { CommonHeaders } from "./common/index.js";
import type { GreasemonkeyGrantOptions } from "./greasemonkey/types.js";
import type { TampermonkeyGrantOptions } from "./tampermonkey/types.js";
import type { ViolentmonkeyGrantOptions } from "./violentmonkey/types.js";
declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}
export type GrantOptions = GreasemonkeyGrantOptions | TampermonkeyGrantOptions | ViolentmonkeyGrantOptions | "all";
export type UserScriptManagerName = "tampermonkey" | "violentmonkey" | "greasemonkey";
export type HeaderGenerator<T extends GrantOptions> = (info: PackageInfo, options: RequiredProps<GeneratorOptions<T>, "spaces">) => Promise<string>;
export type HeaderEntry<T> = [keyof T & string, string];
export type HeaderEntries<T> = HeaderEntry<T>[];
export declare const generateGrantHeaders: <T extends CommonHeaders, U extends GrantOptions>(grantMap: Record<U, T["grant"]>, grants: U[]) => HeaderEntries<T>;
export declare const generateExcludeHeaders: <T extends CommonHeaders>(excludes: string[]) => HeaderEntries<T>;
export declare const generateExcludeMatchHeaders: <T extends {
    "exclude-match": string[];
}>(excludes: string[]) => HeaderEntries<T>;
export declare const generateMatchHeaders: <T extends CommonHeaders>(matches: string[], networkSiteScraper: () => Promise<NetworkSiteInfo[]>, collapse?: boolean) => Promise<HeaderEntries<T>>;
export declare const generateRunAtHeaders: <T extends {
    "run-at": string;
}>(runAtMap: { [P in RunAtOption]?: T["run-at"]; } & {
    [x: string]: unknown;
}, runAt: T["run-at"]) => HeaderEntries<Pick<T, "run-at">>;
export declare const generateRequireHeaders: (requires: string[]) => HeaderEntries<{
    require: string;
}>;
