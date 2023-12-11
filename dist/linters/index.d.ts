/// <reference path="../../src/linters/eslint-plugin-userscripts.d.ts" />
export type LintOptions = {
    fix?: boolean;
    isHomepageAllowed?: boolean;
    spaces?: number;
};
export type LintResult = {
    error: string;
    headers: string;
};
export declare const lintHeaders: (metadataBlock: string, options?: LintOptions) => Promise<LintResult>;
