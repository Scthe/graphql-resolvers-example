import GqlContext from "GqlContext";
import { Person, Gender } from "typingsGql";
import { BaseResolverType, copyFromRestResponse } from "utils/graphql";

import { Person as PersonFromAPI } from "dataSources/tvmaze/PeopleAPI";
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

const getItem = (root: RootType, context: GqlContext) => {
  return context.dataSources.peopleAPI.getOne(root);
};

const countryOfBirth = async (
  root: RootType,
  _args: any,
  context: GqlContext
): Promise<string | null> => {
  const item = await getItem(root, context);
  return item.country?.name || null;
};

const gender = async (
  root: RootType,
  _args: any,
  context: GqlContext
): Promise<Gender | null> => {
  const item = await getItem(root, context);
  const gender = item.gender;
  if (gender === "Male") {
    return Gender.Male;
  } else if (gender === "Female") {
    return Gender.Female;
  }
  return null;
};

const resolver: ResolverType = {
  id: (root: RootType) => root,
  name: copyFromRestResponse(getItem, "name"),
  birthday: copyFromRestResponse(getItem, "birthday"),
  deathday: copyFromRestResponse(getItem, "deathday"),
  gender,
  countryOfBirth,
  castCredits: (root: RootType) => ({ personId: root }),
};

export default resolver;
