import { IResolverObject } from "apollo-server";
import { GraphQLResolveInfo } from "graphql";
import { ListMeta } from "typingsGql";
import GqlContext from "../GqlContext";

/** Resolver factory for simple properties */
export const copyFromRestResponse = <RootT, RestResponse, K extends keyof RestResponse>(
  getItem: (root: RootT, ctx: GqlContext) => Promise<RestResponse>,
  propName: K
) => {
  // we return resolver
  return async (
    root: RootT,
    _: any,
    context: GqlContext
  ): Promise<RestResponse[K]> => {
    const item = await getItem(root, context);
    return item[propName];
  }
};


/////////
// Types:

/** Resolver returns either value or a promise */
type ResolverFnReturnType<T> = T | Promise<T>;

type IFieldResolver<RootType, TReturnType, TArgs = Record<string, any>> =
  (source: RootType, args: TArgs, context: GqlContext, info: GraphQLResolveInfo) => ResolverFnReturnType<TReturnType>;

/**
 * We resolve the object based on generated schema typings.
 * Also remove '__typename' from object definition.
 * We can also override property types if needed.
 */
type MergeResolverTypes<T, Overrides> =
  Omit<T, keyof Overrides | "__typename"> & Overrides;

type ResolverKeys<T, Overrides> =
  keyof Required<MergeResolverTypes<T, Overrides>>

export type BaseResolverType<RootType, T, Overrides extends Partial<Record<keyof T, any>> = {}> = {
  // We add Required<> to make sure even optional properties have the resolver.
  [k in ResolverKeys<T, Overrides>]: IFieldResolver<
    RootType,
    MergeResolverTypes<T, Overrides>[k]
  >
};

export type PaginatedResolver<RootType, TNode = ID> = {
  node: IFieldResolver<RootType, TNode[]>;
  meta: IFieldResolver<RootType, ListMeta>;
};