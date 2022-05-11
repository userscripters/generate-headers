export const getLongest = (words) => Math.max(...words.map(({ length }) => length));
export const scase = (text) => `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
export const mdLink = (lbl, href) => `[${lbl}](${href})`;
export const uniqify = (arr) => [...new Set(arr)];
