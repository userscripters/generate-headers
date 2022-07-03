import { ESLint } from "eslint";
import { configs } from "eslint-plugin-userscripts";
export const lintHeaders = async (metadataBlock, options = {}) => {
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
    return {
        error: await formatter.format(results),
        headers: fix && output ? output : metadataBlock
    };
};
