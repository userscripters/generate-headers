import { PackageInfo } from "./utils";
export declare type UserScriptManagerName = "tampermonkey" | "violentmonkey" | "greasemonkey";
export declare type HeaderGenerator = (info: PackageInfo) => string;
export declare type GeneratorMap = {
    [P in UserScriptManagerName]: HeaderGenerator;
};
export declare const generateGreasemnonkeyHeaders: HeaderGenerator;
export declare const generateTampermonkeyHeaders: HeaderGenerator;
export declare const generateViolentMonkeyHeaders: HeaderGenerator;
