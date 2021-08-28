export declare type RequiredProps<T, K extends keyof T = keyof T> = T & {
    [P in K]-?: T[P];
};
export declare const getLongest: (words: string[]) => number;
export declare const scase: (text: string) => string;
export declare const mdLink: (lbl: string, href: string) => string;
