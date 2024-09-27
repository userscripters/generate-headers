import type { HeaderEntries } from "./index.js";

export type CustomHeaders = { contributors: string } & Record<string, string>;

/**
 * @summary generates custom headers not built-in to any of the managers
 * @param custom list of custom headers
 */
export const generateCustomHeaders = (custom: string[]): HeaderEntries<CustomHeaders> => {
    return custom.map((pair) => {
        const [name, value = ""] = pair.split(/\s+/);
        return [name, value];
    });
};
