import type { CommonGeneratorOptions } from "./generators/common/index.js";
import type { GrantOptions, UserScriptManagerName } from "./generators/index.js";
export type RunAtOption = "start" | "end" | "idle" | "body" | "menu";
export type GeneratorOptions<T extends GrantOptions> = CommonGeneratorOptions & {
    collapse: boolean;
    custom?: string[];
    direct?: boolean;
    downloadURL?: string;
    eol?: string;
    excludes?: string[];
    fix?: boolean;
    grants?: T[];
    homepage?: string;
    inject?: string;
    lint?: boolean;
    matches?: string[];
    output: string;
    packagePath: string;
    pretty?: boolean;
    requires?: string[];
    run?: RunAtOption;
    spaces?: number;
    updateURL?: string;
    whitelist?: ("self" | "localhost" | "*")[] | string[];
};
export interface WriteHeadersOptions {
    cli: boolean;
    direct: boolean;
    eol?: string;
    output: string;
}
export declare const managersSupportingHomepage: Set<UserScriptManagerName>;
export declare const writeHeaders: (content: string, options: WriteHeadersOptions) => Promise<string>;
export declare const generate: <T extends GrantOptions>(type: UserScriptManagerName, options: GeneratorOptions<T>, cli?: boolean) => Promise<string>;
