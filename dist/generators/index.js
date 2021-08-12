"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRunAtHeaders = exports.generateMatchHeaders = exports.generateGrantHeaders = void 0;
const generateGrantHeaders = (grantMap, grants) => {
    if (grants.find((g) => g === "all")) {
        return Object.entries(grantMap).map(([, v]) => [
            "grant",
            v,
        ]);
    }
    const headers = grants.map((g) => ["grant", grantMap[g]]);
    return headers.length
        ? headers
        : [["grant", "none"]];
};
exports.generateGrantHeaders = generateGrantHeaders;
const generateMatchHeaders = (matches) => {
    return matches.map((uri) => ["match", uri]);
};
exports.generateMatchHeaders = generateMatchHeaders;
const generateRunAtHeaders = (runAtMap, runAt) => {
    const runsAt = runAtMap[runAt];
    return runsAt
        ? [["run-at", runsAt]]
        : [];
};
exports.generateRunAtHeaders = generateRunAtHeaders;
