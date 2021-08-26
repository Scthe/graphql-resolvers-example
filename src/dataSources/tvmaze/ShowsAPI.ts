import RestResource, { ResourceList } from "../RestResource";
import MyDataLoader, { DataLoaderReturnType } from "../MyDataLoader";
import * as tvmaze from "./tvmaze.api";

/*** Structure of the object returned from tvmaze API */
export interface Show {
  id: ID;
  name: string;
  type: string;
  language: string;
  status: string;
  runtime: number;
  premiered: string;
  genres: string[];
  summary: string;
  externals: {
    imdb: string;
  };
}

export type ShowSearchItem = tvmaze.SearchResponseItem<"show", Show>;

/** Api to get shows data */
export default class ShowsAPI extends RestResource {
  constructor() {
    super(tvmaze.URL);
  }

  getOne = async (id: ID): Promise<Show> => this.dataLoader.load(id);

  getByImdbId = async (imdbId: string): Promise<ID> => {
    // TBH we could cache result of this request in `Map<imdbId, ID>`,
    // but no need to complicate for now.
    const show = await this.get<Show>(`/lookup/shows?imdb=${imdbId}`);
    this.addToCache(show);
    return show.id;
  };

  findByName = async (name: string): ResourceList =>
    this.searchDataLoader.load(name);

  private addToCache = (item: Show): void => {
    this.dataLoader.addToCache("id", item);
  };

  private getByIds = async (ids: readonly ID[]): DataLoaderReturnType<Show> => {
    this.debugLog("getByIds", ids);
    // We get array of ids, normally we would want to use api like:
    // `shows/?id=1&id=2&id=42` to get all data in one request (thus solving n+1).
    // Since our API does not have this, we need to do this manually.
    const promises = ids.map((id) => this.get<Show>(`shows/${id}`));
    const result = await Promise.allSettled(promises);

    // It is important that we return objects in same order as `ids` were provided.
    // Since we do not change the order, we can just return result.
    return MyDataLoader.collectSettledPromises(result);
  };

  private searchByShowNames = async (
    searchNames: readonly string[]
  ): DataLoaderReturnType<ID[]> => {
    this.debugLog("searchByShowNames", searchNames);

    const name = searchNames[0]; // batching is off for this request
    const items = await this.get<ShowSearchItem[]>(`search/shows?q=${name}`);
    const ids = items.map((e) => {
      this.addToCache(e.show);
      return e.show.id;
    });
    return [ids]; // wrap in array cause `searchNames` is an array
  };

  // Map<ShowId, Show>
  private dataLoader = new MyDataLoader(this.getByIds);

  // Map<searchedShow, ShowId[]>
  // Separate dataloader that maps search phrase to ID[].
  //
  // We use dataloader, since there is no separate function to get totalCount of shows.
  // In our resolver implementation we call `findByName` twice (once for data and once for totalCount), and we want to deduplicate that with cache.
  private searchDataLoader = new MyDataLoader(this.searchByShowNames, {
    batch: false, // turn off batching - we will always get a single item to `this.search`
  });
}
