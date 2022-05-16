/**
 * @summary finds the biggest length in a list of words
 * @param words list of words
 */
export const getLongest = (words: string[]) =>
    Math.max(...words.map(({ length }) => length));

/**
 * @summary formats a string to sentence case
 * @param text string to format
 */
export const scase = (text: string) =>
    `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;

/**
 * @summary makes a Markdown-formatted link
 * @param label link label
 * @param href link URL
 */
export const mdLink = (label: string, href: string) => `[${label}](${href})`;

/**
 * @summary uniquifies an array
 * @param arr array to remove duplicates from
 */
export const uniquify = <T>(arr: T[]) => [...new Set(arr)];
