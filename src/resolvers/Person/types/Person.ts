import GqlContext from "GqlContext";
import { Gender, PersonResolvers } from "typingsGql";
import { copyFromRestResponse } from "utils/graphql";

export type RootType = ID;

type ResolverType = PersonResolvers;

const getItem = (root: RootType, context: GqlContext) => {
  return context.dataSources.peopleAPI.getOne(root);
};

const countryOfBirth = async (
  root: RootType,
  _args: unknown,
  context: GqlContext
): Promise<string | null> => {
  const item = await getItem(root, context);
  return item.country?.name || null;
};

const gender = async (
  root: RootType,
  _args: unknown,
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
  id: async (root: RootType) => root,
  name: copyFromRestResponse(getItem, "name"),
  // Bug in `graphql-codegen`: `birthday` is nullable in schema, but the generated code allows only `null` and not `undefined`
  birthday: copyFromRestResponse(getItem, "birthday") as any,
  deathday: copyFromRestResponse(getItem, "deathday") as any,
  gender,
  countryOfBirth,
  castCredits: async (root: RootType) => ({ personId: root }),
};

export default resolver;
