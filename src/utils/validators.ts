import { EOL } from "os";
import { valid } from "semver";
import validator from "validator";
import { makeMonkeyTags } from "../generators/common/monkey";
import { type PackageInfo } from "./package";
import type { RequiredOnly } from "./types";

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
        readline.on("close", () => resolve([openTagOffset, closeTagOffset]));
    });
};

export const validateMatchHeaders = (matches: string[]) => {
    const validationRegex =
        /^((?:https?|file|ftp|\*)(?=:\/\/)|(?:urn(?=:))):(?:\/\/)?(?:((?:\*||.+?)(?=\/|$)))?(\/\*|(?:.+?\*?)+)?|<all_urls>|all|meta$/;
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
