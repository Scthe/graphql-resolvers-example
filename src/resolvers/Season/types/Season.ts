import GqlContext from "GqlContext";
import { Season } from "typingsGql";
import { BaseResolverType, copyFromRestResponse } from "utils/graphql";

import { RootType as ShowType } from "../../Show/types/Show";
import { RootType as EpisodesListType } from "../../Episode/types/EpisodesList";

export type RootType = { id: ID; showId: ID };

type ResolverType = BaseResolverType<
  RootType,
  Season,
  {
    id: ID;
    show: ShowType;
    episodes: EpisodesListType;
  }
>;

const getItem = (root: RootType, context: GqlContext) => {
  return context.dataSources.seasonsAPI.getOne(root.id);
};

const show = (root: RootType): ShowType => root.showId;

const episodes = (root: RootType): EpisodesListType => ({
  showId: root.showId,
  seasonId: root.id,
});

const resolver: ResolverType = {
  id: (root: RootType) => root.id,
  idx: copyFromRestResponse(getItem, "number"),
  summary: copyFromRestResponse(getItem, "summary"),
  show,
  episodes,
};

export default resolver;
