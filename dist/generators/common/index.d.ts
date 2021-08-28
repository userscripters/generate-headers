import { HeaderEntries } from "..";
import { PackageInfo } from "../../utils/package";
export declare const generateCommonHeaders: ({ author, description, name, version, icon, contributors, }: PackageInfo, pretty: boolean) => HeaderEntries<{
    author: import("../../utils/package").PackagePerson;
    contributors?: import("../../utils/package").PackagePerson[] | undefined;
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
