import GqlContext from "GqlContext";
import { listMetaResolver, PaginatedResolver } from "utils/graphql";
import { RootType as NodeType } from "./Show";

// Arguments for search. You can also add `ordering` here etc.
export type RootType = {
  name: string;
};
type ResolverType = PaginatedResolver<RootType, NodeType>;

const getItems = (root: RootType, context: GqlContext) => {
  return context.dataSources.showsAPI.findByName(root.name);
};

const node = (
  root: RootType,
  _args: unknown,
  context: GqlContext
): Promise<NodeType[]> => {
  return getItems(root, context);
};

const resolver: ResolverType = {
  node,
  meta: listMetaResolver(getItems),
};

export default resolver;
