import { GrantOptions, UserScriptManagerName } from "./generators";
export declare type RunAtOption = "start" | "end" | "idle" | "body" | "menu";
export declare type GeneratorOptions<T extends GrantOptions> = {
    packagePath: string;
    output: string;
    spaces?: number;
    inject?: string;
    matches?: string[];
    collapse: boolean;
    grants?: T[];
    run?: RunAtOption;
    direct?: boolean;
    pretty?: boolean;
};
export declare const generate: <T extends GrantOptions>(type: UserScriptManagerName, { packagePath, output, spaces, collapse, direct, matches, ...rest }: GeneratorOptions<T>) => Promise<string>;
