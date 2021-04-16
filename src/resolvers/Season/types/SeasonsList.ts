import GqlContext from "GqlContext";
import { ListMeta } from "typingsGql";
import { PaginatedResolver } from "utils/graphql";
import { RootType as NodeType } from "./Season";

export type RootType = {
  showId: ID;
};
type ResolverType = PaginatedResolver<RootType, NodeType>;

const getItems = (root: RootType, context: GqlContext) => {
  return context.dataSources.seasonsAPI.getByShow(root.showId);
};

const meta = async (root: RootType, _args: any, context: GqlContext): Promise<ListMeta> => {
  const ids = await getItems(root, context);
  return {
    totalCount: ids.length
  };
};

const node = async (root: RootType, _args: any, context: GqlContext): Promise<NodeType[]> => {
  const ids = await getItems(root, context);
  return ids.map(id => ({ id, showId: root.showId }));
};

const resolver: ResolverType = {
  node,
  meta,
};


export default resolver;