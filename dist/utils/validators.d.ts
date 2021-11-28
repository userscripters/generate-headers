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
    missing: ("description" | "name" | "author" | "version" | "homepage" | "bugs" | "repository" | "license")[];
};
