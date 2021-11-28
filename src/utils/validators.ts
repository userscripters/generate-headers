import { valid } from "semver";
import validator from "validator";
import { PackageInfo } from "./package";
import { RequiredOnly } from "./types";

export const validateMatchHeaders = (matches: string[]) => {
    const validationRegex =
        /^((?:https?|file|ftp|\*)(?=:\/\/)|(?:urn(?=:))):(?:\/\/)?(?:((?:\*||.+?)(?=\/|$)))?(\/\*|(?:.+?\*?)+)?|<all_urls>|all$/;
    const invalid = matches.filter((match) => !validationRegex.test(match));
    return {
        invalid,
        status: !invalid.length,
        valid: matches.filter((m) => !invalid.includes(m)),
    };
};

export const validateRequiredHeaders = (packageInfo: PackageInfo) => {
    const required: (keyof RequiredOnly<PackageInfo>)[] = [
        "author",
        "name",
        "version",
        "description",
    ];
    const missing = required.filter((p) => !(p in packageInfo));

    const { homepage, version } = packageInfo;

    const isValidVersion = !!valid(version);
    const isValidHomepage = homepage === void 0 || validator.isURL(homepage);

    const status = [isValidVersion, isValidHomepage, !missing.length].reduce(
        (a, c) => a && c
    );

    return {
        status,
        isValidVersion,
        isValidHomepage,
        missing,
    };
};
