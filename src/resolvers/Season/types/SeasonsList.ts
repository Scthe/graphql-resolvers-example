import GqlContext from "GqlContext";
import { listMetaResolver, PaginatedResolver } from "utils/graphql";
import { RootType as NodeType } from "./Season";

export type RootType = {
  showId: ID;
};
type ResolverType = PaginatedResolver<RootType, NodeType>;

const getItems = (root: RootType, context: GqlContext) => {
  return context.dataSources.seasonsAPI.getByShow(root.showId);
};

const node = async (
  root: RootType,
  _args: unknown,
  context: GqlContext
): Promise<NodeType[]> => {
  const ids = await getItems(root, context);
  return ids.map((id) => ({ id, showId: root.showId }));
};

const resolver: ResolverType = {
  node,
  meta: listMetaResolver(getItems),
};

export default resolver;
