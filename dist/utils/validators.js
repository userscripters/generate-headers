"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequiredHeaders = exports.validateMatchHeaders = void 0;
const semver_1 = require("semver");
const validator_1 = require("validator");
const validateMatchHeaders = (matches) => {
    const validationRegex = /^((?:https?|file|ftp|\*)(?=:\/\/)|(?:urn(?=:))):(?:\/\/)?(?:((?:\*||.+?)(?=\/|$)))?(\/\*|(?:.+?\*?)+)?|<all_urls>/;
    const invalid = matches.filter((match) => !validationRegex.test(match));
    return {
        invalid,
        status: !invalid.length,
        valid: matches.filter((m) => !invalid.includes(m)),
    };
};
exports.validateMatchHeaders = validateMatchHeaders;
const validateRequiredHeaders = (packageInfo) => {
    const required = [
        "author",
        "name",
        "homepage",
        "version",
        "description",
    ];
    const missing = required.filter((p) => !(p in packageInfo));
    const { homepage, version } = packageInfo;
    const isValidVersion = !!semver_1.valid(version);
    const isValidHomepage = validator_1.default.isURL(homepage);
    const status = [isValidVersion, isValidHomepage, !missing.length].reduce((a, c) => a && c);
    return {
        status,
        isValidVersion,
        isValidHomepage,
        missing,
    };
};
exports.validateRequiredHeaders = validateRequiredHeaders;
