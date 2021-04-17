import RestResource, { ResourceList } from "../RestResource";
import MyDataLoader, { DataLoaderReturnType } from "../MyDataLoader";
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

type EpisodeBySeasonKey = { showId: ID; seasonId: ID };

/** Api to get episodes data */
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
  ): DataLoaderReturnType<Episode> => {
    const promises = ids.map((id) => this.get<Episode>(`/episodes/${id}`));
    const result = await Promise.allSettled(promises);
    return MyDataLoader.collectSettledPromises(result);
  };

  private search = async (
    keys: readonly EpisodeBySeasonKey[]
  ): DataLoaderReturnType<ID[]> => {
    const promises = keys.map((key) =>
      this.get<Episode[]>(`seasons/${key.seasonId}/episodes`)
    );
    const result = await Promise.allSettled(promises);

    return MyDataLoader.collectSettledPromises(result, (episodes) => {
      this.addToCache(...episodes);
      return episodes.map((e) => e.id);
    });
  };

  // has to be on the end of the file, cause `this.getByIds` is undefined otherwise
  private dataLoader = new MyDataLoader(this.getByIds);

  // Separate dataloader that maps {showId, seasonId} to ids of episodes.
  // IMPORTANT: this dataloader has a composite key. We could have used just seasonID,
  // but this is a better showcase od DataLoader.
  private bySeasonDataLoader = new MyDataLoader(this.search);
}
