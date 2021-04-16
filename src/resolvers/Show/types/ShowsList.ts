import GqlContext from "GqlContext";
import { ListMeta } from "typingsGql";
import { PaginatedResolver } from "utils/graphql";
import { RootType as NodeType } from "./Show";

// Arguments for search. You can also add `ordering` here etc.
export type RootType = {
  name: string;
};
type ResolverType = PaginatedResolver<RootType, NodeType>;

const getItems = (root: RootType, context: GqlContext) => {
  return context.dataSources.showsAPI.findByName(root.name);
};

const meta = async (root: RootType, _args: any, context: GqlContext): Promise<ListMeta> => {
  const ids = await getItems(root, context);
  return {
    totalCount: ids.length
  };
};

const node = (root: RootType, _args: any, context: GqlContext): Promise<NodeType[]> => {
  return getItems(root, context);
};

const resolver: ResolverType = {
  node,
  meta,
};


export default resolver;