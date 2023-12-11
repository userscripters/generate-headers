export type ParsedName = {
    scope?: string;
    packageName: string;
};
export declare const parseName: (name: string) => ParsedName;
export declare const prettifyName: (packageName: string) => string;
