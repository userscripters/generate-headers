import { PackageInfo } from "./package";
export declare const formatAuthor: ({ name, email, url, }: Exclude<PackageInfo["author"], string>) => string;
export declare const parseAuthor: (info: PackageInfo["author"]) => Exclude<PackageInfo["author"], string>;
