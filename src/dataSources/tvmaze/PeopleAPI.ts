import RestResource, { ResourceList } from "../RestResource";
import MyDataLoader, { DataLoaderReturnType } from "../MyDataLoader";
import * as tvmaze from "./tvmaze.api";

/*** Structure of the object returned from tvmaze API */
export interface Person {
  id: ID;
  name: string;
}

export type PersonSearchItem = tvmaze.SearchResponseItem<"person", Person>;

/** Api to get people data */
export default class PeopleAPI extends RestResource {
  constructor() {
    super(tvmaze.URL);
  }

  getOne = async (id: ID): Promise<Person> => this.dataLoader.load(id);

  findByName = async (name: string): ResourceList =>
    this.searchDataLoader.load(name);

  private addToCache = (item: Person): void => {
    this.dataLoader.addToCache("id", item);
  };

  private getByIds = async (
    ids: readonly ID[]
  ): DataLoaderReturnType<Person> => {
    // http://api.tvmaze.com/people/25439?embed=castcredits
    // const mockPerson = (id: ID): Person => ({ id, name: "mock-name" });
    // return ids.map(mockPerson);

    // TODO `people/${id}?embed=castcredits` ?
    const promises = ids.map((id) => this.get<Person>(`people/${id}`));
    const result = await Promise.allSettled(promises);

    // It is important that we return objects in same order as `ids` were provided.
    // Since we do not change the order, we can just return result.
    return MyDataLoader.collectSettledPromises(result);
  };

  private search = async (
    searchNames: readonly string[]
  ): DataLoaderReturnType<ID[]> => {
    const name = searchNames[0]; // batching is off for this request
    const items = await this.get<PersonSearchItem[]>(`search/people?q=${name}`);
    const ids = items.map((e) => {
      this.addToCache(e.person);
      return e.person.id;
    });
    return [ids]; // wrap in array cause `searchNames` is an array
  };

  private dataLoader = new MyDataLoader(this.getByIds);

  private searchDataLoader = new MyDataLoader(this.search, {
    batch: false, // turn off batching - we will always get a single item to `this.search`
  });
}
