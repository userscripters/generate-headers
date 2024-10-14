export interface LintOptions {
    fix?: boolean;
    isHomepageAllowed?: boolean;
    spaces?: number;
}
export interface LintResult {
    error: string;
    headers: string;
}
export declare const lintHeaders: (metadataBlock: string, options?: LintOptions) => Promise<LintResult>;
