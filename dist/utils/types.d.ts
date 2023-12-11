export type RequiredOnly<T> = {
    [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};
export type RequiredProps<T, K extends keyof T = keyof T> = T & {
    [P in K]-?: T[P];
};
export type OnlyOptional<T> = {
    [P in keyof T as undefined extends T[P] ? P : never]: T[P];
};
