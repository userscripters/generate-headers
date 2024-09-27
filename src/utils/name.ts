import { scase } from "./common.js";

export interface ParsedName {
    scope?: string;
    packageName: string;
}

/**
 * @summary parses a given name into an scope and unscoped package name pair
 * @param name scoped package name
 */
export const parseName = (name: string): ParsedName => {
    const [, scope, packageName] = (/(?:@([\w-]+)\/)?([\w-]+)/.exec(name)) || [];
    return { scope, packageName };
};

/**
 * @summary pretty-formats a given name
 * @param packageName package name
 */
export const prettifyName = (packageName: string) =>
    packageName.split("-").map(scase).join(" ");
