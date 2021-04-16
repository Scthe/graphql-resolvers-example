import fetch, { Response } from "node-fetch";
import { DataSource } from "apollo-datasource";
import GqlContext from "GqlContext";
import { SwapiResourceType, SwapiResponse, SwapiSingleObject } from "./swapiTypes";
import { createSearchParamsStr } from "utils";

const URL = "https://www.swapi.tech/api";

export type ResourceList = Promise<ID[]>;

export default abstract class SwapiResource<SwapiType extends object, DataType extends object> extends DataSource<GqlContext> {
  // const DataLoader = require('dataloader')
  // userLoader = new DataLoader(keys => myBatchGetUsers(keys))

  constructor(protected readonly resourceType: SwapiResourceType) {
    super();
  }

  // initialize(config: DataSourceConfig<GqlContext>): void | Promise<void> {
  // true && config; // unused, feel free to override this method in subclass
  // }

  protected async getById(id: ID): Promise<DataType> {
    const url = `${URL}/${this.resourceType}/${id}`;
    const data = await this.get<SwapiSingleObject<SwapiType>>(url);
    return this.adaptData(data.properties);

    /*
    const rawResp: Response = await fetch(url);
    const rawData: SwapiObjectResponse<SwapiType> = await rawResp.json();
    console.log(rawData)

    if (rawData.message === "ok") {
      return this.adaptData(rawData.result.properties);
    } else {
      throw new Error(`SWAPI error: '${rawData.message}'`)
    }
    */
  }

  protected async findMany(params: Record<string, string>): Promise<ID[]> {
    const paramsStr = createSearchParamsStr(params);
    const url = `${URL}/${this.resourceType}/`; // ?${paramsStr}
    const data = await this.get<any>(url);
    console.log(data);
    return [];
    // return this.adaptData(data.properties);
  }

  protected async get<T>(url: string): Promise<T> {
    console.log(`[FETCH] '${url}'`);
    const rawResp: Response = await fetch(url);
    const rawData: SwapiResponse<T> = await rawResp.json();
    console.log(rawData)

    if (rawData.message === "ok") {
      return rawData.result;
    } else {
      throw new Error(`SWAPI error: '${rawData.message}'`)
    }
  }

  protected abstract adaptData(data: SwapiType): DataType;

  // util to extract id from swapi url
  parseId = (url: string): ID => parseInt(url.split('/')[5], 10) as any;
  parseArray = (urls?: string[]): ID[] => (urls || []).map(this.parseId);
}
