import { readFile } from "fs/promises";
export const getPackage = async (path) => {
    try {
        const contents = await readFile(path, { encoding: "utf-8" });
        return JSON.parse(contents);
    }
    catch {
        return null;
    }
};
