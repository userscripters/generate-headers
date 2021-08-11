"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMatchHeaders = exports.generateGrantHeaders = void 0;
const generateGrantHeaders = (grantMap, grants) => {
    const grantHeaders = grants.map((grant) => [
        "grant",
        grantMap[grant],
    ]);
    return grantHeaders.length
        ? grantHeaders
        : [["grant", "none"]];
};
exports.generateGrantHeaders = generateGrantHeaders;
const generateMatchHeaders = (matches) => {
    return matches.map((uri) => ["match", uri]);
};
exports.generateMatchHeaders = generateMatchHeaders;