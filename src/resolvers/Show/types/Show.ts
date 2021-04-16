import GqlContext from "GqlContext";
import { Show } from "typingsGql";
import { BaseResolverType, copyFromRestResponse } from "utils/graphql";
import { RootType as SeasonsListType } from "../../Season/types/SeasonsList";

export type RootType = ID;

type ResolverType = BaseResolverType<
  RootType,
  Show,
  {
    id: RootType;
    seasons: SeasonsListType;
  }
>;

const getItem = (id: RootType, context: GqlContext) => {
  return context.dataSources.showsAPI.getOne(id);
};

const resolver: ResolverType = {
  id: (root: RootType) => root,
  name: copyFromRestResponse(getItem, "name"),
  type: copyFromRestResponse(getItem, "type"),
  language: copyFromRestResponse(getItem, "language"),
  genres: copyFromRestResponse(getItem, "genres"),
  status: copyFromRestResponse(getItem, "status"),
  runtime: copyFromRestResponse(getItem, "runtime"),
  premiered: copyFromRestResponse(getItem, "premiered"),
  // network: copyFromRestResponse(getItem, "network"),
  // country: copyFromRestResponse(getItem, "country"),
  summary: copyFromRestResponse(getItem, "summary"),
  seasons: (root: RootType) => ({ showId: root }),
};

export default resolver;
