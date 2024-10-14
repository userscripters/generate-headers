import { ESLint } from "eslint";
import userscripts from "eslint-plugin-userscripts";
export const lintHeaders = async (metadataBlock, options = {}) => {
    const { fix = false, isHomepageAllowed = false, spaces = 4 } = options;
    const eslint = new ESLint({
        baseConfig: {
            plugins: { userscripts },
            rules: {
                ...userscripts.configs.recommended.rules,
                "userscripts/align-attributes": ["error", spaces],
                "userscripts/use-homepage-and-url": isHomepageAllowed ? "error" : "off",
                "userscripts/filename-user": "off",
            },
        },
        overrideConfigFile: true,
        fix,
    });
    const results = await eslint.lintText(metadataBlock);
    const [{ output }] = results;
    const formatter = await eslint.loadFormatter("stylish");
    return {
        error: await formatter.format(results),
        headers: fix && output ? output : metadataBlock,
    };
};
