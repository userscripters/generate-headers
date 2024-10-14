export type PackagePerson = string | {
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
export declare const getPackage: (path: string) => Promise<PackageInfo | null>;
