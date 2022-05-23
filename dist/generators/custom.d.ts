import type { HeaderEntries } from "./index.js";
export declare type CustomHeaders = {
    contributors: string;
} & {
    [name: string]: string;
};
export declare const generateCustomHeaders: (custom: string[]) => HeaderEntries<CustomHeaders>;
