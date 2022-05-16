import type { GeneratorOptions } from "../generate.js";
import type { GrantOptions } from "../generators/index.js";
import type { PackageInfo } from "./package.js";
import type { OnlyOptional } from "./types.js";
export declare type OptionalHeadersValidationResult = {
    isValidDownloadURL: boolean;
    isValidUpdateURL: boolean;
};
export declare type HeadersValidationResult = {
    invalid: string[];
    status: boolean;
    valid: string[];
};
export declare type RequiredHeadersValidationResult = {
    status: boolean;
    isValidVersion: boolean;
    isValidHomepage: boolean;
    missing: string[];
};
export declare const getExistingHeadersOffset: (path: string | URL, eol?: string) => Promise<[number, number]>;
export declare const validateMatchHeaders: (matches: string[]) => HeadersValidationResult;
export declare const validateExcludeHeaders: (excludes: string[]) => HeadersValidationResult;
export declare const validateConnectHeaders: (whitelist: string[]) => HeadersValidationResult;
export declare const validateRequiredHeaders: (packageInfo: PackageInfo) => RequiredHeadersValidationResult;
export declare const validateOptionalHeaders: <T extends GrantOptions>(options: OnlyOptional<GeneratorOptions<T>>) => OptionalHeadersValidationResult;
