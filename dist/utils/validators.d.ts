import type { GeneratorOptions } from "../generate.js";
import type { GrantOptions } from "../generators/index.js";
import { type PackageInfo } from "./package.js";
declare type OnlyOptional<T> = {
    [P in keyof T as undefined extends T[P] ? P : never]: T[P];
};
interface OptionalHeadersValidationResult {
    isValidDownloadURL: boolean;
    isValidUpdateURL: boolean;
}
export declare const getExistingHeadersOffset: (path: string | URL, eol?: string) => Promise<[number, number]>;
export declare const validateMatchHeaders: (matches: string[]) => {
    invalid: string[];
    status: boolean;
    valid: string[];
};
export declare const validateExcludeHeaders: (excludes: string[]) => {
    invalid: string[];
    status: boolean;
    valid: string[];
};
export declare const validateConnectHeaders: (whitelist: string[]) => {
    invalid: string[];
    status: boolean;
    valid: string[];
};
export declare const validateRequiredHeaders: (packageInfo: PackageInfo) => {
    status: boolean;
    isValidVersion: boolean;
    isValidHomepage: boolean;
    missing: ("author" | "name" | "description" | "homepage" | "version" | "bugs" | "repository" | "license")[];
};
export declare const validateOptionalHeaders: <T extends GrantOptions>(options: OnlyOptional<GeneratorOptions<T>>) => OptionalHeadersValidationResult;
export {};
