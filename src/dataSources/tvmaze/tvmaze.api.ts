export const URL = "https://api.tvmaze.com";

export type SearchResponseItem<
  Key extends string | number | symbol,
  T extends object
> = {
  [k in Key]: T;
} & {
  score: number;
};

export type Embedded<T> = {
  _embedded: T;
};
