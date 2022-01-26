"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequiredHeaders = exports.validateConnectHeaders = exports.validateMatchHeaders = exports.getExistingHeadersOffset = void 0;
const os_1 = require("os");
const semver_1 = require("semver");
const validator_1 = __importDefault(require("validator"));
const monkey_1 = require("../generators/common/monkey");
const getExistingHeadersOffset = async (path, eol = os_1.EOL) => {
    const { createInterface } = await Promise.resolve().then(() => __importStar(require("readline")));
    const { createReadStream } = await Promise.resolve().then(() => __importStar(require("fs")));
    const filestream = createReadStream(path, { encoding: "utf-8" });
    const readline = createInterface(filestream);
    let currentOffset = 0;
    let openTagOffset = -1;
    let closeTagOffset = -1;
    const { length: eolNumChars } = eol;
    const [openTag, closeTag] = (0, monkey_1.makeMonkeyTags)();
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
exports.getExistingHeadersOffset = getExistingHeadersOffset;
const validateMatchHeaders = (matches) => {
    const validationRegex = /^((?:https?|file|ftp|\*)(?=:\/\/)|(?:urn(?=:))):(?:\/\/)?(?:((?:\*||.+?)(?=\/|$)))?(\/\*|(?:.+?\*?)+)?|<all_urls>|all|meta$/;
    const invalid = matches.filter((match) => !validationRegex.test(match));
    return {
        invalid,
        status: !invalid.length,
        valid: matches.filter((m) => !invalid.includes(m)),
    };
};
exports.validateMatchHeaders = validateMatchHeaders;
const validateConnectHeaders = (whitelist) => {
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
exports.validateConnectHeaders = validateConnectHeaders;
const validateRequiredHeaders = (packageInfo) => {
    const required = [
        "author",
        "name",
        "version",
        "description",
    ];
    const missing = required.filter((p) => !(p in packageInfo));
    const { homepage, version } = packageInfo;
    const isValidVersion = !!(0, semver_1.valid)(version);
    const isValidHomepage = homepage === void 0 || validator_1.default.isURL(homepage);
    const status = [isValidVersion, isValidHomepage, !missing.length].reduce((a, c) => a && c);
    return {
        status,
        isValidVersion,
        isValidHomepage,
        missing,
    };
};
exports.validateRequiredHeaders = validateRequiredHeaders;
