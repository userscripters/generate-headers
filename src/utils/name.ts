import { scase } from "./common.js";

export const parseName = (name: string) => {
    const [, scope, packageName] = name.match(/(?:@([\w-]+)\/)?([\w-]+)/) || [];
    return { scope, packageName };
};

export const prettifyName = (packageName: string) =>
    packageName.split("-").map(scase).join(" ");
