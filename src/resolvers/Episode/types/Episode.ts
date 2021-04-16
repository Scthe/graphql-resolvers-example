import GqlContext from "GqlContext";
import { Episode } from "typingsGql";
import { BaseResolverType, copyFromRestResponse } from "utils/graphql";

import { RootType as ShowType } from "../../Show/types/Show";
import { RootType as SeasonType } from "../../Season/types/Season";

export type RootType = {
  id: ID;
  showId: ID;
  seasonId: ID;
};

type ResolverType = BaseResolverType<
  RootType,
  Episode,
  {
    id: ID;
    show: ShowType;
    season: SeasonType;
  }
>;

const getItem = (root: RootType, context: GqlContext) => {
  return context.dataSources.episodesAPI.getOne(root.id);
};

const resolver: ResolverType = {
  id: (root: RootType) => root.id,
  idx: copyFromRestResponse(getItem, "idx"),
  summary: copyFromRestResponse(getItem, "summary"),
  airdate: copyFromRestResponse(getItem, "airdate"),
  name: copyFromRestResponse(getItem, "name"),
  runtime: copyFromRestResponse(getItem, "runtime"),
  season: (root: RootType) => ({ id: root.seasonId, showId: root.showId }),
  show: (root: RootType) => root.showId,
};

export default resolver;
