import GqlContext from "GqlContext";
import { listMetaResolver, PaginatedResolver } from "utils/graphql";
import { RootType as NodeType } from "./Episode";

export type RootType = {
  showId: ID;
  seasonId: ID;
};
type ResolverType = PaginatedResolver<RootType, NodeType>;

const getItems = (root: RootType, context: GqlContext) => {
  return context.dataSources.episodesAPI.findBySeason(
    root.showId,
    root.seasonId
  );
};

const node = async (
  root: RootType,
  _args: any,
  context: GqlContext
): Promise<NodeType[]> => {
  const ids = await getItems(root, context);
  return ids.map((id) => ({
    id,
    showId: root.showId,
    seasonId: root.seasonId,
  }));
};

const resolver: ResolverType = {
  node,
  meta: listMetaResolver(getItems),
};

export default resolver;
