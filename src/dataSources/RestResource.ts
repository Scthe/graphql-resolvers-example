import url from "url";
import fetch, { Response } from "node-fetch";
import chalk from "chalk";
import { DataSource, DataSourceConfig } from "apollo-datasource";

import GqlContext from "GqlContext";
import log from "utils/log";

export type ResourceList = Promise<ID[]>;

export default abstract class RestResource extends DataSource<GqlContext> {
  // will be defined during runtime (after `initialize`)
  protected gqlContext: GqlContext = null as any;

  constructor(protected readonly baseURL = "") {
    super();
  }

  initialize(config: DataSourceConfig<GqlContext>): void | Promise<void> {
    this.gqlContext = config.context;
  }

  protected async get<T>(url: string): Promise<T> {
    const finalUrl = this.createUrl(url);
    log(chalk.cyan("[FETCH]"), `'${finalUrl}'`);
    const rawResp: Response = await fetch(finalUrl);
    const rawData: T = await rawResp.json();
    return rawData;
  }

  private createUrl(urlStr: string): string {
    const urlObj = new url.URL(urlStr, this.baseURL);
    return urlObj.href;
  }

  protected debugLog(...args: any[]): void {
    log(chalk.green(`[Dataloader ${this.constructor.name}]`), ...args);
  }
}
