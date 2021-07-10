import { GeneratorOptions } from ".";
import { PackageInfo, RequiredProps } from "./utils";
declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}
export declare type UserScriptManagerName = "tampermonkey" | "violentmonkey" | "greasemonkey";
export declare type GrantOptions = "get" | "set" | "list" | "delete" | "unsafe" | "close" | "focus" | "change";
declare type CommonGrants = "none";
export declare type GreasemonkeyGrants = CommonGrants | "GM.setValue" | "GM.getValue" | "GM.listValues" | "GM.deleteValue";
export declare type TampermonkeyGrants = CommonGrants | "GM_setValue" | "GM_getValue" | "GM_listValues" | "GM_deleteValue" | "unsafeWindow" | "window.close" | "window.focus" | "window.onurlchange";
export declare type HeaderGenerator = (info: PackageInfo, options: RequiredProps<GeneratorOptions, "spaces">) => string;
export declare type GeneratorMap = {
    [P in UserScriptManagerName]: HeaderGenerator;
};
export declare const generateGreasemnonkeyHeaders: HeaderGenerator;
export declare const generateTampermonkeyHeaders: HeaderGenerator;
export declare const generateViolentMonkeyHeaders: HeaderGenerator;
export {};
