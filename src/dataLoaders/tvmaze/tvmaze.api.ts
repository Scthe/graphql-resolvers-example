export const URL = "https://api.tvmaze.com";

export type ApiListResponse<Key extends string | number | symbol, T extends object> = {
  [k in Key]: T;
} & {
  score: number;
}
