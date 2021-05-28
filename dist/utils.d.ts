declare type PackagePerson = string | {
    name: string;
    email?: string;
    url?: string;
};
export declare type PackageInfo = {
    author: PackagePerson;
    contributors?: PackagePerson[];
    icon?: string;
    license: string;
    homepage: string;
    name: string;
    version: `${number}.${number}.${number}`;
    description: string;
    bugs: {
        url: string;
    };
    repository: {
        type: "git" | "https";
        url: string;
    };
};
export declare const getPackage: (path: string) => Promise<PackageInfo | null>;
export declare const getLongest: (words: string[]) => number;
export declare const scase: (text: string) => string;
export declare const mdLink: (lbl: string, href: string) => string;
export declare const formatAuthor: ({ name, email, url, }: Exclude<PackageInfo["author"], string>) => string;
export declare const parseAuthor: (info: PackageInfo["author"]) => Exclude<PackageInfo["author"], string>;
export {};
