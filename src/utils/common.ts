export type RequiredProps<T, K extends keyof T = keyof T> = T & {
    [P in K]-?: T[P];
};

export const getLongest = (words: string[]) =>
    Math.max(...words.map(({ length }) => length));

export const scase = (text: string) =>
    `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;

export const mdLink = (lbl: string, href: string) => `[${lbl}](${href})`;

export const uniqify = <T>(arr: T[]) => [...new Set(arr)];
