import GqlContext from "GqlContext";
import { ShowCharacter } from "typingsGql";
import { BaseResolverType, copyFromRestResponse } from "utils/graphql";

import { RootType as ShowType } from "../../Show/types/Show";
import { RootType as PersonType } from "../../Person/types/Person";

export type RootType = ID;

type ResolverType = BaseResolverType<
  RootType,
  ShowCharacter,
  {
    id: ID;
    show: ShowType;
    person: PersonType;
  }
>;

const getItem = (root: RootType, context: GqlContext) => {
  return context.dataSources.showCharactersAPI.getOne(root);
};

const resolver: ResolverType = {
  id: (root: RootType) => root,
  name: copyFromRestResponse(getItem, "name"),
  person: copyFromRestResponse(getItem, "person"),
  show: copyFromRestResponse(getItem, "show"),
};

export default resolver;
