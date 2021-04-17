import url from "url";
import fetch, { Response } from "node-fetch";
import { DataSource } from "apollo-datasource";
import GqlContext from "GqlContext";

export type ResourceList = Promise<ID[]>;
type DataLoaderResult<T> = T | Error;
export type DataloaderReturnType<T> = Promise<DataLoaderResult<T>[]>;

export default abstract class RestResource extends DataSource<GqlContext> {
  constructor(protected readonly baseURL = "") {
    super();
  }

  // initialize(config: DataSourceConfig<GqlContext>): void | Promise<void> {
  // unused, feel free to override this method in subclass
  // }

  protected async get<T>(url: string): Promise<T> {
    const finalUrl = this.createUrl(url);
    console.log(`[FETCH] '${finalUrl}'`);
    const rawResp: Response = await fetch(finalUrl);
    const rawData: T = await rawResp.json();
    return rawData;
  }

  private createUrl(urlStr: string): string {
    const urlObj = new url.URL(urlStr, this.baseURL);
    return urlObj.href;
  }

  protected collectSettledPromises<T, E = T>(
    results: PromiseSettledResult<T>[],
    mapperFn?: (e: T) => E
  ): DataLoaderResult<E>[] {
    return results.map((e) => {
      if (e.status === "rejected") {
        return e.reason;
      }
      const mapper = mapperFn || ((a: T): E => a as any);
      return mapper(e.value);
    });
  }
}
