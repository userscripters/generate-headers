import { readFile } from "fs/promises";

export type PackagePerson =
    | string
    | {
        name: string;
        email?: string;
        url?: string;
    };

export interface PackageInfo {
    author: PackagePerson;
    contributors?: PackagePerson[];
    icon?: string;
    license?: string;
    homepage: string;
    keywords?: string[];
    name: string;
    version: `${number}.${number}.${number}` | `${number}.${number}`;
    description: string;
    bugs: {
        url: string;
    };
    repository: {
        type: "git" | "https";
        url: string;
    };
}

/**
 * @summary gets a package.json file info
 * @param path path to package.json
 */
export const getPackage = async (path: string): Promise<PackageInfo | null> => {
    try {
        const contents = await readFile(path, { encoding: "utf-8" });

        return JSON.parse(contents) as PackageInfo;
    } catch {
        return null;
    }
};
