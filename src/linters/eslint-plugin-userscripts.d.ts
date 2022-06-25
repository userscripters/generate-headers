declare module "eslint-plugin-userscripts" {
    import { ESLint, Linter } from "eslint";

    export const configs: Record<string, Linter.Config>;

    export const rules: ESLint.Plugin["rules"];
}