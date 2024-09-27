/**
 * @summary replaces file contents given start and end offsets
 * @param pathlike file path or URL to replace content of
 * @param startOffset start offset (in bytes)
 * @param endOffset end offset (in bytes)
 * @param newContent content to replace with
 */
export const replaceFileContent = async (
    pathlike: string | URL,
    startOffset: number,
    endOffset: number,
    newContent: string,
) => {
    const { writeFile, readFile } = await import("fs/promises");

    const original = await readFile(pathlike);

    const update = Buffer.concat([
        original.subarray(0, startOffset),
        Buffer.from(newContent),
        original.subarray(endOffset),
    ]);

    return writeFile(pathlike, update);
};
