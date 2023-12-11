import { scase } from "./common.js";
export const parseName = (name) => {
    const [, scope, packageName] = name.match(/(?:@([\w-]+)\/)?([\w-]+)/) || [];
    return { scope, packageName };
};
export const prettifyName = (packageName) => packageName.split("-").map(scase).join(" ");
