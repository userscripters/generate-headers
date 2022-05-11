import { EOL } from "os";
import semver from "semver";
import validator from "validator";
import { makeMonkeyTags } from "../generators/common/monkey.js";
export const getExistingHeadersOffset = async (path, eol = EOL) => {
    const { createInterface } = await import("readline");
    const { createReadStream } = await import("fs");
    const filestream = createReadStream(path, { encoding: "utf-8" });
    const readline = createInterface(filestream);
    let currentOffset = 0;
    let openTagOffset = -1;
    let closeTagOffset = -1;
    const { length: eolNumChars } = eol;
    const [openTag, closeTag] = makeMonkeyTags();
    return new Promise((resolve, reject) => {
        readline.on("line", (line) => {
            const { length: bytesInLine } = Buffer.from(line);
            if (line === openTag)
                openTagOffset = currentOffset;
            if (line === closeTag)
                closeTagOffset = currentOffset + bytesInLine;
            if (openTagOffset > -1 && closeTagOffset > -1) {
                readline.close();
            }
            currentOffset += bytesInLine + eolNumChars;
        });
        readline.on("error", reject);
        readline.on("close", () => resolve([openTagOffset, closeTagOffset]));
    });
};
export const validateMatchHeaders = (matches) => {
    const validationRegex = /^((?:https?|file|ftp|\*)(?=:\/\/)|(?:urn(?=:))):(?:\/\/)?(?:((?:\*||.+?)(?=\/|$)))?(\/\*|(?:.+?\*?)+)?|<all_urls>|all|meta$/;
    const invalid = matches.filter((match) => !validationRegex.test(match));
    return {
        invalid,
        status: !invalid.length,
        valid: matches.filter((m) => !invalid.includes(m)),
    };
};
export const validateConnectHeaders = (whitelist) => {
    const specialWordRegex = /^localhost|self|\*$/;
    const ipv4Regex = /^((?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.|$)){4}/;
    const domainRegex = /^(?!.*?_.*?)(?!(?:[\w]+?\.)?\-[\w\.\-]*?)(?![\w]+?\-\.(?:[\w\.\-]+?))(?=[\w])(?=[\w\.\-]*?\.+[\w\.\-]*?)(?![\w\.\-]{254})(?!(?:\.?[\w\-\.]*?[\w\-]{64,}\.)+?)[\w\.\-]+?(?<![\w\-\.]*?\.[\d]+?)(?<=[\w\-]{2,})(?<![\w\-]{25})$/;
    const checks = [specialWordRegex, ipv4Regex, domainRegex];
    const invalid = whitelist.filter((remote) => !checks.some((r) => r.test(remote)));
    return {
        invalid,
        status: !invalid.length,
        valid: whitelist.filter((r) => !invalid.includes(r))
    };
};
export const validateRequiredHeaders = (packageInfo) => {
    const required = [
        "author",
        "name",
        "version",
        "description",
    ];
    const missing = required.filter((p) => !(p in packageInfo));
    const { homepage, version } = packageInfo;
    const isValidVersion = !!semver.valid(version);
    const isValidHomepage = homepage === void 0 || validator.isURL(homepage);
    const status = [isValidVersion, isValidHomepage, !missing.length].reduce((a, c) => a && c);
    return {
        status,
        isValidVersion,
        isValidHomepage,
        missing,
    };
};
export const validateOptionalHeaders = (options) => {
    const { downloadURL, updateURL } = options;
    const isValidDownloadURL = downloadURL === void 0 || validator.isURL(downloadURL);
    const isValidUpdateURL = updateURL === void 0 || validator.isURL(updateURL);
    return {
        isValidDownloadURL,
        isValidUpdateURL
    };
};
