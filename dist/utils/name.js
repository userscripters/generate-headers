import { scase } from "./common.js";
export const parseName = (name) => {
    const [, scope, packageName] = (/(?:@([\w-]+)\/)?([\w-]+)/.exec(name)) || [];
    return { scope, packageName };
};
export const prettifyName = (packageName) => packageName.split("-").map(scase).join(" ");
