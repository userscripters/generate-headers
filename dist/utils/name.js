"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettifyName = exports.parseName = void 0;
const common_1 = require("./common");
const parseName = (name) => {
    const [, scope, packageName] = name.match(/(?:@([\w-]+)\/)?([\w-]+)/) || [];
    return { scope, packageName };
};
exports.parseName = parseName;
const prettifyName = (packageName) => packageName.split("-").map(common_1.scase).join(" ");
exports.prettifyName = prettifyName;
