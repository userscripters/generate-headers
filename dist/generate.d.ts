import type { GrantOptions, UserScriptManagerName } from "./generators/index";
export declare type RunAtOption = "start" | "end" | "idle" | "body" | "menu";
export declare type GeneratorOptions<T extends GrantOptions> = {
    packagePath: string;
    output: string;
    spaces?: number;
    inject?: string;
    matches?: string[];
    collapse: boolean;
    eol?: string;
    grants?: T[];
    whitelist?: Array<"self" | "localhost" | "*"> | string[];
    run?: RunAtOption;
    direct?: boolean;
    pretty?: boolean;
};
export declare const generate: <T extends GrantOptions>(type: UserScriptManagerName, { packagePath, output, spaces, eol, collapse, direct, matches, whitelist, ...rest }: GeneratorOptions<T>) => Promise<string>;
