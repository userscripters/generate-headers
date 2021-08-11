"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = void 0;
const promises_1 = require("fs/promises");
const getPackage = async (path) => {
    try {
        const contents = await promises_1.readFile(path, { encoding: "utf-8" });
        return JSON.parse(contents);
    }
    catch (error) {
        return null;
    }
};
exports.getPackage = getPackage;
