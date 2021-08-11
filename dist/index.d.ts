import { GrantOptions, UserScriptManagerName } from "./generators";
export declare type RunAtOption = "start" | "end" | "idle" | "body" | "menu";
export declare type GeneratorOptions<T extends GrantOptions> = {
    packagePath: string;
    output: string;
    spaces?: number;
    inject?: string;
    matches?: string[];
    grants?: T[];
    run?: RunAtOption;
    direct?: boolean;
};
export declare const generate: <T extends GrantOptions>(type: UserScriptManagerName, { packagePath, output, spaces, direct, matches, ...rest }: GeneratorOptions<T>) => Promise<string>;
