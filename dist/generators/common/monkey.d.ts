import { CustomHeaders } from "../custom.js";
import type { HeaderEntries, HeaderEntry } from "../index.js";
import type { CommonHeaders } from "./index.js";
export type MonkeyHeader = `// @${string} ${string}` | `// @${string}`;
export declare const makeMonkeyTags: (name?: string) => readonly [openTag: string, closeTag: string];
export declare const makeMonkeyHeader: <T extends CommonHeaders>(header: HeaderEntry<T>) => MonkeyHeader;
export declare const finalizeMonkeyHeaders: <T extends CommonHeaders<CustomHeaders>>(headers: HeaderEntries<T>, spaces: number) => string;
