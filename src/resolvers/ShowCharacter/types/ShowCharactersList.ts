import { ResourceList } from "dataSources/RestResource";
import GqlContext from "GqlContext";
import { listMetaResolver, PaginatedResolver } from "utils/graphql";
import { RootType as NodeType } from "./ShowCharacter";

type SearchByPerson = { personId: ID };
type SearchByShow = { showId: ID };
const isSearchByPerson = (root: RootType): root is SearchByPerson =>
  (root as SearchByPerson).personId != null;
const isSearchByShow = (root: RootType): root is SearchByShow =>
  (root as SearchByShow).showId != null;

/** We can seach show characters by either person or show. Only one should be defined */
export type RootType = SearchByPerson | SearchByShow;

type ResolverType = PaginatedResolver<RootType, NodeType>;

const getItems = (root: RootType, context: GqlContext): ResourceList => {
  // Just in case if someone has not checked the types correctly
  if (isSearchByPerson(root) && isSearchByShow(root)) {
    throw new Error(
      "Tried to search for show characters, but both show or person were provided. tvmaze API does not support this"
    );
  }

  const dataSource = context.dataSources.showCharactersAPI;
  if (isSearchByPerson(root)) {
    return dataSource.findByPerson(root.personId);
  } else if (isSearchByShow(root)) {
    return dataSource.findByShow(root.showId);
  }

  throw new Error(
    "Tried to search for show characters, but neither show or person was provided"
  );
};

const node = async (
  root: RootType,
  _args: any,
  context: GqlContext
): Promise<NodeType[]> => {
  return getItems(root, context);
};

const resolver: ResolverType = {
  node,
  meta: listMetaResolver(getItems),
};

export default resolver;
