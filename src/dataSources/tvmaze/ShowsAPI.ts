import DataLoader from "dataloader";

import RestResource, {
  DataloaderReturnType,
  ResourceList,
} from "../RestResource";
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
  network: string;
  country: string;
  summary: string;
}

type ShowsListItem = tvmaze.ApiListResponse<"show", Show>;

export default class ShowsAPI extends RestResource {
  constructor() {
    super(tvmaze.URL);
  }

  getOne = async (id: ID): Promise<Show> => this.dataLoader.load(id);

  findByName = async (name: string): ResourceList =>
    this.searchDataLoader.load(name);

  private addToCache = (item: Show): void => {
    this.dataLoader.prime(item.id, item);
  };

  private getByIds = async (ids: readonly ID[]): DataloaderReturnType<Show> => {
    // We get array of ids, normally we would want to use api like:
    // `shows/?id=1&id=2&id=42` to get all data in one request (thus solving n+1).
    // Since our API does not have this, we need to do this manually.
    const promises = ids.map((id) => this.get<Show>(`shows/${id}`));
    const result = await Promise.allSettled(promises);

    // It is important that we return objects in same order as `ids` were provided.
    // Since we do not change the order, we can just return result.
    return this.collectSettledPromises(result);
  };

  private search = async (
    searchNames: readonly string[]
  ): DataloaderReturnType<ID[]> => {
    const name = searchNames[0]; // batching is off for this request
    const items = await this.get<ShowsListItem[]>(`search/shows?q=${name}`);
    const ids = items.map((e) => {
      this.addToCache(e.show);
      return e.show.id;
    });
    return [ids]; // wrap in array cause `searchNames` is an array
  };

  // has to be on the end of the file, cause `this.getByIds` is undefined otherwise
  private dataLoader = new DataLoader(this.getByIds);

  // Separate dataloader that maps search phrase to ID[].
  // Since ID[] is not the same as `Show`.
  // We use dataloader, since there is no separate function to get totalCount of shows.
  // In our resolver implementation we call `findByName` twice (once for data and once for totalCount), and we want to deduplicate that with cache.
  private searchDataLoader = new DataLoader(this.search, {
    batch: false, // turn off batching - we will always get a single item to `this.search`
  });
}
