import { GrantOptions, UserScriptManagerName } from "./generators";
export declare type GeneratorOptions<T extends GrantOptions> = {
    packagePath: string;
    output: string;
    spaces?: number;
    matches?: string[];
    grants?: T[];
    direct?: boolean;
};
export declare const generate: <T extends GrantOptions>(type: UserScriptManagerName, { packagePath, output, spaces, direct, matches, ...rest }: GeneratorOptions<T>) => Promise<string>;
