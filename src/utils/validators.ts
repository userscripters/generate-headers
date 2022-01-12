import { valid } from "semver";
import validator from "validator";
import { makeMonkeyTags } from "../generators/common/monkey";
import { type PackageInfo } from "./package";
import type { RequiredOnly } from "./types";

export const getExistingHeadersPosition = async (path: string | URL) => {
    const { createInterface } = await import("readline");
    const { createReadStream } = await import("fs");

    const filestream = createReadStream(path, { encoding: "utf-8" });
    const readline = createInterface(filestream);

    let currentLine = 0;
    let openTagLine = -1;
    let closeTagLine = -1;

    const [openTag, closeTag] = makeMonkeyTags();

    return new Promise<[number, number]>((resolve, reject) => {
        readline.on("line", (line) => {
            currentLine += 1;

            if (line === openTag) openTagLine = currentLine;
            if (line === closeTag) closeTagLine = currentLine;

            if (openTagLine > -1 && closeTagLine > -1) {
                readline.close();
            }
        });

        readline.on("error", reject);
        readline.on("close", () => resolve([openTagLine, closeTagLine]));
    });
};

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
