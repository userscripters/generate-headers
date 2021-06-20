import { UserScriptManagerName } from "./generators";
export declare type GeneratorOptions = {
    packagePath: string;
    output: string;
    spaces?: number;
    matches?: string[];
    direct?: boolean;
};
export declare const generate: (type: UserScriptManagerName, { packagePath, output, spaces, direct, ...rest }: GeneratorOptions) => Promise<string>;
