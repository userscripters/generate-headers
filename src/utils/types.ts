//@see https://stackoverflow.com/a/68261391/11407695
export type RequiredOnly<T> = {
    [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};
