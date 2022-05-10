import type { PackageInfo } from "./package.js";

export const formatAuthor = ({
    name,
    email,
    url,
}: Exclude<PackageInfo["author"], string>) =>
    name + (email ? ` <${email}>` : "") + (url ? ` (${url})` : "");

export const parseAuthor = (
    info: PackageInfo["author"]
): Exclude<PackageInfo["author"], string> => {
    if (typeof info === "object") return info;

    const authorRegex = /(\w+(?:\s\w+)?)(?:\s<(.+?)>)?(?:\s\((.+?)\))?$/i;

    const match = authorRegex.exec(info);

    if (!match) throw new Error(`unable to parse author field: ${info}`);

    const [_full, name, email, url] = match;

    return {
        name,
        email,
        url,
    };
};
