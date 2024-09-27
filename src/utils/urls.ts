/**
 * @summary explodes paths of a given URL string
 * @param url url to explode paths of
 */
export const explodePaths = (url: string): string[] => {
    try {
        const { pathname, hash, origin, password, search, username } = new URL(url);

        const decoded = decodeURIComponent(pathname);

        const passPaths = (path: string, paths: string[], pass = 0): string[] => {
            const pathSegments = path.replace(/^\//, "").split("/");

            const pathSegment = pathSegments[pass];
            if (!pathSegment) return [...paths, path];

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
    } catch {
        return [url];
    }
};
