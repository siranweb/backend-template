export interface IAction {
  execute(...args: any): any;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Optional<T> = T | null | undefined;