export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Optional<T> = T | null | undefined;

export interface EntityMeta {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}