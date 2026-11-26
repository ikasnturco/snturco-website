import type { Dictionary } from './en';

export type DeepPartial<T> = T extends (...args: never[]) => unknown ? T : T extends (infer U)[] ? DeepPartial<U>[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
export type PartialDictionary = DeepPartial<Dictionary>;
