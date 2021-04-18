import GqlContext from "GqlContext";
import { QueryShowByImdbArgs } from "typingsGql";
import { RootType as ShopType } from "../types/Show";

export default (
  _root: any,
  args: QueryShowByImdbArgs,
  context: GqlContext
): Promise<ShopType> => {
  // Here we do query to simplify implementation. We overfetch
  // if the user only wants the "imdbId" in response,
  // but it's MUCH simpler to write.
  const api = context.dataSources.showsAPI;
  return api.getByImdbId(args.imdbId);
};
