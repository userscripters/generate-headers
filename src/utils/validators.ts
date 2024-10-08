import { EOL } from "os";
import semver from "semver";
import validator from "validator";
import type { GeneratorOptions } from "../generate.js";
import { makeMonkeyTags } from "../generators/common/monkey.js";
import type { GrantOptions } from "../generators/index.js";
import type { PackageInfo } from "./package.js";
import type { OnlyOptional, RequiredOnly } from "./types.js";

export interface OptionalHeadersValidationResult {
    isValidDownloadURL: boolean;
    isValidUpdateURL: boolean;
};

export interface HeadersValidationResult {
    invalid: string[];
    status: boolean;
    valid: string[];
};

export interface RequiredHeadersValidationResult {
    status: boolean;
    isValidVersion: boolean;
    isValidHomepage: boolean;
    missing: string[];
};

/**
 * @summary calculates existing headers offset from the start of the file
 * @param path path to file with headers
 * @param eol end of line character(s)
 */
export const getExistingHeadersOffset = async (path: string | URL, eol = EOL) => {
    const { createInterface } = await import("readline");
    const { createReadStream } = await import("fs");

    const filestream = createReadStream(path, { encoding: "utf-8" });
    const readline = createInterface(filestream);

    let currentOffset = 0;
    let openTagOffset = -1;
    let closeTagOffset = -1;
    const { length: eolNumChars } = eol;

    const [openTag, closeTag] = makeMonkeyTags();

    return new Promise<[number, number]>((resolve, reject) => {
        readline.on("line", (line) => {
            const { length: bytesInLine } = Buffer.from(line);

            if (line === openTag) openTagOffset = currentOffset;
            if (line === closeTag) closeTagOffset = currentOffset + bytesInLine;

            if (openTagOffset > -1 && closeTagOffset > -1) {
                readline.close();
            }

            currentOffset += bytesInLine + eolNumChars;
        });

        readline.on("error", reject);
        readline.on("close", () => {
            resolve([openTagOffset, closeTagOffset]);
        });
    });
};

/**
 * @summary validates `@match` headers
 * @param matches list of match patterns
 */
export const validateMatchHeaders = (matches: string[]): HeadersValidationResult => {
    const validationRegex
        = /^((?:https?|file|ftp|\*)(?=:\/\/)|(?:urn(?=:))):(?:\/\/)?(?:((?:\*||.+?)(?=\/|$)))?(\/\*|(?:.+?\*?)+)?|<all_urls>|all|meta$/;
    const invalid = matches.filter(match => !validationRegex.test(match));
    return {
        invalid,
        status: !invalid.length,
        valid: matches.filter(m => !invalid.includes(m)),
    };
};

/**
 * @summary validates `@exclude` / `@exclude-match` headers
 * @param excludes list of exclude patterns
 */
export const validateExcludeHeaders = (excludes: string[]): HeadersValidationResult => {
    const validationRegex = /^((?:https?|file|ftp|\*)(?=:\/\/)|(?:urn(?=:))):(?:\/\/)?(?:((?:\*||.+?)(?=\/|$)))?(\/\*|(?:.+?\*?)+)?$/;
    const invalid = excludes.filter(pattern => !validationRegex.test(pattern));
    return {
        invalid,
        status: !invalid.length,
        valid: excludes.filter(e => !invalid.includes(e)),
    };
};

/**
 * @summary validates `@connect` headers
 * @param whitelist list of URIs to whitelist
 */
export const validateConnectHeaders = (whitelist: string[]): HeadersValidationResult => {
    const specialWordRegex = /^localhost|self|\*$/;
    const ipv4Regex = /^((?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.|$)){4}/;
    // https://stackoverflow.com/a/57129482/11407695
    const domainRegex = /^(?!.*?_.*?)(?!(?:[\w]+?\.)?-[\w.-]*?)(?![\w]+?-\.(?:[\w.-]+?))(?=[\w])(?=[\w.-]*?\.+[\w.-]*?)(?![\w.-]{254})(?!(?:\.?[\w\-.]*?[\w-]{64,}\.)+?)[\w.-]+?(?<![\w\-.]*?\.[\d]+?)(?<=[\w-]{2,})(?<![\w-]{25})$/;

    const checks: RegExp[] = [specialWordRegex, ipv4Regex, domainRegex];

    const invalid = whitelist.filter(remote => !checks.some(r => r.test(remote)));
    return {
        invalid,
        status: !invalid.length,
        valid: whitelist.filter(r => !invalid.includes(r)),
    };
};

/**
 * @summary validates required headers
 * @param packageInfo parsed {@link PackageInfo}
 */
export const validateRequiredHeaders = (packageInfo: PackageInfo): RequiredHeadersValidationResult => {
    const required: (keyof RequiredOnly<PackageInfo>)[] = [
        "author",
        "name",
        "version",
        "description",
    ];
    const missing = required.filter(p => !(p in packageInfo));

    const { homepage, version } = packageInfo;

    const isValidVersion = !!semver.valid(version);
    const isValidHomepage = validator.isURL(homepage);

    const status = [isValidVersion, isValidHomepage, !missing.length].reduce(
        (a, c) => a && c,
    );

    return {
        status,
        isValidVersion,
        isValidHomepage,
        missing,
    };
};

/**
 * @summary validates optional headers
 * @param options generator options
 */
export const validateOptionalHeaders = <T extends GrantOptions>(
    options: OnlyOptional<GeneratorOptions<T>>,
): OptionalHeadersValidationResult => {
    const { downloadURL, updateURL } = options;

    const isValidDownloadURL = downloadURL === void 0 || validator.isURL(downloadURL);
    const isValidUpdateURL = updateURL === void 0 || validator.isURL(updateURL);

    return {
        isValidDownloadURL,
        isValidUpdateURL,
    };
};
