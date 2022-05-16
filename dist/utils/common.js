export const getLongest = (words) => Math.max(...words.map(({ length }) => length));
export const scase = (text) => `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
export const mdLink = (label, href) => `[${label}](${href})`;
export const uniquify = (arr) => [...new Set(arr)];
