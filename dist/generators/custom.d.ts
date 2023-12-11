import type { HeaderEntries } from "./index.js";
export type CustomHeaders = {
    contributors: string;
} & {
    [name: string]: string;
};
export declare const generateCustomHeaders: (custom: string[]) => HeaderEntries<CustomHeaders>;
