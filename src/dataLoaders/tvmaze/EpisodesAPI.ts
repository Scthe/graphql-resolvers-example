import { IDelegateToSchemaOptions } from "apollo-server-express";
import objectHash from "object-hash";
import DataLoader from "dataloader";

import RestResource, {
  DataloaderReturnType,
  ResourceList,
} from "../RestResource";
import * as tvmaze from "./tvmaze.api";

/*** Structure of the object returned from tvmaze API */
export interface Episode {
  id: ID;
  idx: number;
  name: string;
  summary?: string;
  airdate: string;
  runtime: number;
}
/** Type returned from listing endpoint */
// type EpisodeListItem = Episode;

type EpisodeBySeasonKey = { showId: ID; seasonId: ID };

export default class EpisodesAPI extends RestResource {
  constructor() {
    super(tvmaze.URL);
  }

  getOne = async (id: ID): Promise<Episode> => this.dataLoader.load(id);

  findBySeason = async (showId: ID, seasonId: ID): ResourceList =>
    this.bySeasonDataLoader.load({
      showId,
      seasonId,
    });

  private addToCache = (...item: Episode[]): void => {
    item.forEach((item) => this.dataLoader.prime(item.id, item));
  };

  private getByIds = async (
    ids: readonly ID[]
  ): DataloaderReturnType<Episode> => {
    const promises = ids.map((id) => this.get<Episode>(`/episodes/${id}`));
    const result = await Promise.allSettled(promises);
    return this.collectSettledPromises(result);
  };

  private search = async (
    keys: readonly EpisodeBySeasonKey[]
  ): DataloaderReturnType<ID[]> => {
    const promises = keys.map((key) =>
      this.get<Episode[]>(`seasons/${key.seasonId}/episodes`)
    );
    const result = await Promise.allSettled(promises);

    return this.collectSettledPromises(result, (episodes) => {
      this.addToCache(...episodes);
      return episodes.map((e) => e.id);
    });
  };

  // has to be on the end of the file, cause `this.getByIds` is undefined otherwise
  private dataLoader = new DataLoader(this.getByIds);

  // Separate dataloader that maps {showId, seasonId} to ids of episodes.
  private bySeasonDataLoader = new DataLoader(this.search, {
    // IMPORTANT: this dataloader has a composite key. We could have used just seasonID,
    // but this is a better showcase od DataLoader.
    cacheKeyFn: (key: EpisodeBySeasonKey) => objectHash(key),
  });
}
