export interface IRedoc {
  make(options: Options): string;
}

export type Options = {
  /** Document title */
  title: string;
  /** Open Api object specification */
  spec: object;
};
