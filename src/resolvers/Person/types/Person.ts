import GqlContext from "GqlContext";
import { Person } from "typingsGql";
import { BaseResolverType, copyFromRestResponse } from "utils/graphql";

import { RootType as ShowCharactersListType } from "../../ShowCharacter/types/ShowCharactersList";

export type RootType = ID;

type ResolverType = BaseResolverType<
  RootType,
  Person,
  {
    id: RootType;
    castCredits: ShowCharactersListType;
  }
>;

const getItem = (id: RootType, context: GqlContext) => {
  return context.dataSources.peopleAPI.getOne(id);
};

const resolver: ResolverType = {
  id: (root: RootType) => root,
  name: copyFromRestResponse(getItem, "name"),
  castCredits: (root: RootType) => ({ personId: root }),
};

export default resolver;
