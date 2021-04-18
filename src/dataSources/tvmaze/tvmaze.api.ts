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

export type Links<K extends string> = {
  _links: {
    [k in K]: {
      href: string;
    };
  };
};

export const getIdFromUrl = (url: string): ID => {
  const numStr = url.match(/\d+/);
  if (numStr != null && numStr.length > 0) {
    return parseInt(numStr[0], 10) as any;
  }
  throw new Error(`Invalid url '${url}' provided to getIdFromUrl`);
};
