import { type PackageInfo } from "./package";
export declare const getExistingHeadersOffset: (path: string | URL, eol?: string) => Promise<[number, number]>;
export declare const validateMatchHeaders: (matches: string[]) => {
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
    missing: ("description" | "name" | "author" | "version" | "homepage" | "bugs" | "repository" | "license")[];
};
