/// <reference path="../../src/linters/eslint-plugin-userscripts.d.ts" />
export declare type LintOptions = {
    fix?: boolean;
    isHomepageAllowed?: boolean;
    spaces?: number;
};
export declare type LintResult = {
    error: string;
    headers: string;
};
export declare const lintHeaders: (metadataBlock: string, options?: LintOptions) => Promise<LintResult>;
