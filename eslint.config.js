import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";

export default tseslint.config({
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
        ...tseslint.configs.recommendedTypeChecked,
        stylistic.configs.customize({
            quotes: "double",
            indent: 4,
            semi: true,
        }),
        {
            languageOptions: {
                parserOptions: {
                    project: true,
                    tsconfigRootDir: import.meta.dirname,
                },
                globals: {
                    ...globals.browser,
                    StackExchange: "readonly"
                },
            },
        },
    ],
    rules: {
        "eqeqeq": "error",
        "no-await-in-loop": "off",
        "no-implicit-coercion": "off",
        "no-loop-func": "error",
        "no-useless-return": "off",
        "no-var": "error",
        "no-undefined": "error",
        "no-unneeded-ternary": "error",
        "no-param-reassign": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "require-await": "error",

        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            { "checksVoidReturn": false }
        ],
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/consistent-indexed-object-style": "off",

        "@stylistic/arrow-parens": "error",
        "@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    }
});