export const removePrefix = (str: string, prefix: string) =>
  str.startsWith("/") ? str.substr(prefix.length) : str;

export type UrlParams = Record<string, string | number>;

export const replaceUrlParams = (endpoint: string, params: UrlParams = {}) => {
  const endpointParts = endpoint.split("/").map((part) => {
    if (part.startsWith(":")) {
      const key = part.substr(1);
      if (params[key] == null) {
        throw new Error(
          `Endpoint '${endpoint}' does not provide value for parameter '${part}'`
        );
      }
      return params[key];
    }

    return part;
  });

  return endpointParts.join("/");
};

export const createSearchParamsStr = (params: Record<string, string>): string =>
  Object.keys(params).filter(key => params[key].length > 0).map(key => `${key}=${params[key]}`).join("&");

