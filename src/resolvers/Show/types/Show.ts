import GqlContext from "GqlContext";
import { Show } from "typingsGql";
import { BaseResolverType, copyFromRestResponse } from "utils/graphql";

import { RootType as SeasonsListType } from "../../Season/types/SeasonsList";
import { RootType as ShowCharactersListType } from "../../ShowCharacter/types/ShowCharactersList";

export type RootType = ID;

type ResolverType = BaseResolverType<
  RootType,
  Show,
  {
    id: ID;
    seasons: SeasonsListType;
    cast: ShowCharactersListType;
  }
>;

const getItem = (id: RootType, context: GqlContext) => {
  return context.dataSources.showsAPI.getOne(id);
};

const imdbId = async (
  root: RootType,
  _args: any,
  context: GqlContext
): Promise<string> => {
  const item = await getItem(root, context);
  return item.externals.imdb;
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
  imdbId,
  seasons: (root: RootType) => ({ showId: root }),
  cast: (root: RootType) => ({ showId: root }),
};

export default resolver;
