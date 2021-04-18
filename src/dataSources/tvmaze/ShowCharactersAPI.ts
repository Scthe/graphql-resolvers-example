import RestResource, { ResourceList } from "../RestResource";
import MyDataLoader, { DataLoaderReturnType } from "../MyDataLoader";
import * as tvmaze from "./tvmaze.api";
import { Embedded } from "./tvmaze.api";

/*** Structure of the object returned from tvmaze API */
export interface ShowCharacter {
  id: ID;
  name: string;
  show: ID;
  person: ID;
}
// type CastCreditWithEmbededCharacter = Embedded<Character>;

/** Api to get people data */
export default class ShowCharactersAPI extends RestResource {
  constructor() {
    super(tvmaze.URL);
  }

  getOne = async (id: ID): Promise<ShowCharacter> => ({
    id,
    name: "mock-show-character",
    show: 118 as any,
    person: 25439 as any,
  });

  // http://api.tvmaze.com/people/25439/castcredits?embed=character
  findByPerson = async (personId: ID): ResourceList => [100, 120, 150] as any;

  // http://api.tvmaze.com/shows/118/cast
  findByShow = async (showId: ID): ResourceList => [200, 230, 270] as any;

  /*
  private addToCache(...)

  private _findByPerson = async (personIds: readonly ID[]): DataLoaderReturnType<ID[]> => {
    const personId = personIds[0]; // batching is off for this request
    const items = await this.get<CastCreditWithEmbededCharacter[]>(`/people/25439/castcredits?embed=character`);
    const ids = items.map((e) => {
      this.addToCache(e);
      return e.id;
    });
    return [ids]; // wrap in array just as dataloader requires
  };

  // private _findByShow = async (ids: readonly ID[]): DataLoaderReturnType<Person> => {
  // http://api.tvmaze.com/people/25439
  // return ids.map(mockPerson);
  // };

  private byPersonDataLoader = new MyDataLoader(this._findByPerson, {
    batch: false,  // turn off batching - we will always get a single item to `this.search`
  });
  */
}
