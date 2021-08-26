import { ResourceList } from "dataSources/RestResource";
import GqlContext from "GqlContext";
import { PeoplesListResolvers } from "typingsGql";
import { listMetaResolver } from "utils/graphql";

// Arguments for search. You can also add `ordering` here etc.
export type RootType = {
  name: string;
};
type ResolverType = PeoplesListResolvers;

const getItems = (root: RootType, context: GqlContext) => {
  return context.dataSources.peopleAPI.findByName(root.name);
};

const node = (
  root: RootType,
  _args: unknown,
  context: GqlContext
): ResourceList => {
  return getItems(root, context);
};

const resolver: ResolverType = {
  node,
  meta: listMetaResolver(getItems),
};

export default resolver;
