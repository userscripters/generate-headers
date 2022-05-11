export const replaceFileContent = async (pathlike, startOffset, endOffset, newContent) => {
    const { writeFile, readFile } = await import("fs/promises");
    const original = await readFile(pathlike);
    const update = Buffer.concat([
        original.slice(0, startOffset),
        Buffer.from(newContent),
        original.slice(endOffset)
    ]);
    return writeFile(pathlike, update);
};
