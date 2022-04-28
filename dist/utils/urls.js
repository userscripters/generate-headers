"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explodePaths = void 0;
const explodePaths = (url) => {
    try {
        const { pathname, hash, origin, password, search, username } = new URL(url);
        const decoded = decodeURIComponent(pathname);
        const passPaths = (path, paths, pass = 0) => {
            const pathSegments = path.replace(/^\//, "").split("/");
            const pathSegment = pathSegments[pass];
            if (!pathSegment)
                return [...paths, path];
            const startOfPath = pathSegments.slice(0, pass).join("/");
            const restOfPath = pathSegments.slice(pass + 1).join("/");
            const alternations = pathSegment.split("|");
            return alternations.flatMap((alt) => {
                const alternated = [startOfPath, alt, restOfPath].join("/");
                return passPaths(alternated, [], pass + 1);
            });
        };
        const exploded = passPaths(decoded, []);
        return exploded.map((path) => {
            const url = new URL(origin);
            url.hash = hash;
            url.password = password;
            url.username = username;
            url.search = search;
            url.pathname = path;
            return url.toString().replace(/\/$/, "");
        });
    }
    catch (error) {
        return [url];
    }
};
exports.explodePaths = explodePaths;
