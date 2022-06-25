/// <reference path="./eslint-plugin-userscripts.d.ts" />

import { ESLint } from "eslint";
import { configs } from "eslint-plugin-userscripts";

export type LintOptions = {
    fix?: boolean;
    isHomepageAllowed?: boolean;
    spaces?: number;
};

export type LintResult = {
    error: string;
    headers: string;
};

/**
 * @summary lints generated userscript headers
 * @param metadataBlock generated headers to lint
 * @param options lint configuration
 */
export const lint = async (metadataBlock: string, options: LintOptions = {}): Promise<LintResult> => {
    const { fix = false, isHomepageAllowed = false, spaces = 4 } = options;

    const eslint = new ESLint({
        baseConfig: {
            plugins: ["userscripts"],
            rules: {
                ...configs.recommended.rules,
                "userscripts/align-attributes": ["error", spaces],
                "userscripts/use-homepage-and-url": isHomepageAllowed ? "error" : "off",
            },
        },
        useEslintrc: false,
        fix,
    });

    const results = await eslint.lintText(metadataBlock);

    const [{ output }] = results;

    const formatter = await eslint.loadFormatter("stylish");

    console.log(await formatter.format(results));

    return {
        error: await formatter.format(results),
        headers: fix && output ? output : metadataBlock
    };
};

(async () => {
    const output = await lint(`// ==UserScript==
// @author          benjol
// @name            Auto Review Comments
// @contributors    double beep (https://github.com/double-beep), Oleg Valter (https://github.com/Oaphi)
// @description     No more re-typing the same comments over and over!
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_setValue
// @homepage        https://github.com/userscripters/SE-AutoReviewComments#readme
// @match           https://*.stackexchange.com/questions/*
// @match           https://*.stackexchange.com/review/*
// @match           https://askubuntu.com/questions/*
// @match           https://askubuntu.com/review/*
// @match           https://es.meta.stackoverflow.com/questions/*
// @match           https://es.meta.stackoverflow.com/review/*
// @match           https://es.stackoverflow.com/questions/*
// @match           https://es.stackoverflow.com/review/*
// @match           https://ja.meta.stackoverflow.com/questions/*
// @match           https://ja.meta.stackoverflow.com/review/*
// @match           https://ja.stackoverflow.com/questions/*
// @match           https://ja.stackoverflow.com/review/*
// @match           https://mathoverflow.net/questions/*
// @match           https://mathoverflow.net/review/*
// @match           https://meta.askubuntu.com/questions/*
// @match           https://meta.askubuntu.com/review/*
// @match           https://meta.mathoverflow.net/questions/*
// @match           https://meta.mathoverflow.net/review/*
// @match           https://meta.serverfault.com/questions/*
// @match           https://meta.serverfault.com/review/*
// @match           https://meta.stackoverflow.com/questions/*
// @match           https://meta.stackoverflow.com/review/*
// @match           https://meta.superuser.com/questions/*
// @match           https://meta.superuser.com/review/*
// @match           https://pt.meta.stackoverflow.com/questions/*
// @match           https://pt.meta.stackoverflow.com/review/*
// @match           https://pt.stackoverflow.com/questions/*
// @match           https://pt.stackoverflow.com/review/*
// @match           https://ru.meta.stackoverflow.com/questions/*
// @match           https://ru.meta.stackoverflow.com/review/*
// @match           https://ru.stackoverflow.com/questions/*
// @match           https://ru.stackoverflow.com/review/*
// @match           https://serverfault.com/questions/*
// @match           https://serverfault.com/review/*
// @match           https://stackapps.com/questions/*
// @match           https://stackapps.com/review/*
// @match           https://stackoverflow.com/questions/*
// @match           https://stackoverflow.com/review/*
// @match           https://superuser.com/questions/*
// @match           https://superuser.com/review/*
// @run-at          document-start
// @source          git+https://github.com/userscripters/SE-AutoReviewComments.git
// @supportURL      https://github.com/userscripters/SE-AutoReviewComments/issues
// @version         1.4.7
// ==/UserScript==

`);

    console.log(output);
})();