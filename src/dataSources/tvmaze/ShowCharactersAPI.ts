import RestResource, { ResourceList } from "../RestResource";
import MyDataLoader, { DataLoaderReturnType } from "../MyDataLoader";
import * as tvmaze from "./tvmaze.api";
import { Person } from "./PeopleAPI";

/** Structure of the object returned from tvmaze API */

/** */
export interface ShowCharacter {
  id: ID;
  name: string;
  show: ID;
  person: ID;
}
type CastCreditWithEmbededCharacter = tvmaze.Embedded<{
  character: Pick<ShowCharacter, "id" | "name">;
}> &
  tvmaze.Links<"show" | "character">;

type ShowCast = {
  person: Person;
  character: Pick<ShowCharacter, "id" | "name">;
};

/** Api to get people data */
export default class ShowCharactersAPI extends RestResource {
  private cache = new Map<ID, ShowCharacter>();

  constructor() {
    super(tvmaze.URL);
  }

  getOne = async (id: ID): Promise<ShowCharacter> => {
    if (!this.cache.has(id)) {
      // Normally we would have separate REST request, but API does not have it.
      // This method should be called with ids from `findByPerson`/`findByShow` only.
      throw new Error(
        `No show character with id='${id}' in cache, this should never happen`
      );
    }
    return this.cache.get(id)!;
  };

  findByPerson = async (personId: ID): ResourceList =>
    this.byPersonDataLoader.load(personId);

  findByShow = async (showId: ID): ResourceList =>
    this.byShowDataLoader.load(showId);

  private addToCache = (item: ShowCharacter): void => {
    this.cache.set(item.id, item);
  };

  private _findByPerson = async (
    personIds: readonly ID[]
  ): DataLoaderReturnType<ID[]> => {
    this.debugLog("_findByPerson", personIds);

    const personId = personIds[0]; // batching is off for this request
    const items = await this.get<CastCreditWithEmbededCharacter[]>(
      `/people/${personId}/castcredits?embed=character`
    );
    const ids = items.map((e) => {
      this.addToCache({
        id: e._embedded.character.id,
        name: e._embedded.character.name,
        person: personId,
        show: tvmaze.getIdFromUrl(e._links.show.href),
      });
      return e._embedded.character.id;
    });
    return [ids]; // wrap in array just as dataloader requires
  };

  private _findByShow = async (
    showIds: readonly ID[]
  ): DataLoaderReturnType<ID[]> => {
    this.debugLog("_findByShow", showIds);

    const showId = showIds[0]; // batching is off for this request
    const items = await this.get<ShowCast[]>(`shows/${showId}/cast`);
    const ids = items.map((e) => {
      this.gqlContext.dataSources.peopleAPI.addToCache(e.person);

      this.addToCache({
        id: e.character.id,
        name: e.character.name,
        person: e.person.id,
        show: showId,
      });
      return e.character.id;
    });
    return [ids]; // wrap in array just as dataloader requires
  };

  // Map<PersonId, ShowCharacterId[]>
  private byPersonDataLoader = new MyDataLoader(this._findByPerson, {
    batch: false,
  });

  // Map<ShowId, ShowCharacterId[]>
  private byShowDataLoader = new MyDataLoader(this._findByShow, {
    batch: false,
  });
}
