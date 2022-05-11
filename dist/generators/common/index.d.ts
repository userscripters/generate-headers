import type { PackageInfo } from "../../utils/package.js";
import type { HeaderEntries } from "../index.js";
export declare type CommonGeneratorOptions = {
    namespace?: string;
    pretty?: boolean;
};
export declare const generateCommonHeaders: (pkg: PackageInfo, options: CommonGeneratorOptions) => HeaderEntries<{
    author: import("../../utils/package.js").PackagePerson;
    contributors?: import("../../utils/package.js").PackagePerson[] | undefined;
    description: string;
    exclude: string[];
    icon: string;
    include: string[];
    match: string[];
    name: string;
    namespace: string;
    noframes: "";
    resource: string[];
    require: string[];
    version: `${number}.${number}.${number}`;
    grant: string;
}>;
