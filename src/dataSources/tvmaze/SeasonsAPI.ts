import RestResource, { ResourceList } from "../RestResource";
import MyDataLoader, { DataLoaderReturnType } from "../MyDataLoader";
import * as tvmaze from "./tvmaze.api";

/*** Structure of the object returned from tvmaze API */
export interface Season {
  id: ID;
  number: number;
  summary?: string;
}
/** Type returned from listing endpoint */
type SeasonListItem = Season;

/** Api to get seasons data */
export default class SeasonsAPI extends RestResource {
  private cache = new Map<ID, Season>();

  constructor() {
    super(tvmaze.URL);
  }

  getOne = async (id: ID): Promise<Season> => {
    if (!this.cache.has(id)) {
      // Normally we would have separate REST request, but API does not have it.
      // This method should be called with ids from `getByShow` only.
      throw new Error(
        `No season with id='${id}' in cache, this should never happen`
      );
    }
    return this.cache.get(id)!;
  };

  getByShow = (showId: ID): ResourceList => this.dataLoader.load(showId);

  private addToCache = (item: Season): void => {
    this.cache.set(item.id, item);
  };

  private _getByShow = async (
    showIds: readonly ID[]
  ): DataLoaderReturnType<ID[]> => {
    const showId = showIds[0]; // batching is off for this request
    const items = await this.get<SeasonListItem[]>(`/shows/${showId}/seasons`);
    const ids = items.map((e) => {
      this.addToCache(e);
      return e.id;
    });
    return [ids]; // wrap in array cause `showIds` is an array
  };

  private dataLoader = new MyDataLoader(this._getByShow, {
    batch: false, // turn off batching - we will always get a single item to `this.search`
  });
}
