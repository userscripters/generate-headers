import { UserScriptManagerName } from "./generators";
declare type GeneratorOptions = {
    packagePath: string;
    output: string;
    spaces?: number;
    direct?: boolean;
};
export declare const generate: (type: UserScriptManagerName, { packagePath, output, spaces, direct }: GeneratorOptions) => Promise<string>;
export {};
