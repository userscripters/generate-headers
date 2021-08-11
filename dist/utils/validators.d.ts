import { PackageInfo } from "./package";
export declare const validateMatchHeaders: (matches: string[]) => {
    invalid: string[];
    status: boolean;
    valid: string[];
};
export declare const validateRequiredHeaders: (packageInfo: PackageInfo) => {
    status: boolean;
    isValidVersion: boolean;
    isValidHomepage: boolean;
    missing: ("description" | "name" | "version" | "author" | "homepage" | "bugs" | "repository" | "license")[];
};
