import { PackageInfo } from "./utils";
declare global {
    interface String {
        padEnd<T extends string>(maxLength: number, fillString?: string): T;
    }
}
export declare type UserScriptManagerName = "tampermonkey" | "violentmonkey" | "greasemonkey";
export declare type HeaderGenerator = (info: PackageInfo, spaces: number) => string;
export declare type GeneratorMap = {
    [P in UserScriptManagerName]: HeaderGenerator;
};
export declare const generateGreasemnonkeyHeaders: HeaderGenerator;
export declare const generateTampermonkeyHeaders: HeaderGenerator;
export declare const generateViolentMonkeyHeaders: HeaderGenerator;
