import fs from "fs";
import glob from "glob";
import { gql } from "apollo-server-express";
import { GraphQLResolveInfo } from "graphql";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { DocumentNode } from "graphql";
import chalk from "chalk";

import { ListMeta } from "typingsGql";
import GqlContext from "../GqlContext";
import log from "./log";
import { ResourceList } from "dataSources/RestResource";

/////////
// init utils

export const loggingPlugin: ApolloServerPlugin<GqlContext> = {
  requestDidStart() {
    return {
      didResolveOperation(gqlReq) {
        const opName =
          gqlReq.operationName != null
            ? gqlReq.operationName
            : "unknown_operation";
        log(chalk.green.bold("GQL"), opName);
      },
    };
  },
};

export const stitchSchema = (
  rootDir: string,
  sufix = ".graphql"
): DocumentNode[] => {
  const schemaFiles = glob.sync(`${rootDir}/**/*${sufix}`);
  return schemaFiles.map((filePath) =>
    gql(fs.readFileSync(filePath, { encoding: "utf8" }))
  );
};

/////////
// Resolver utils

/** Resolver factory for simple properties */
export const copyFromRestResponse = <
  RootT,
  RestResponse,
  K extends keyof RestResponse
>(
  getItem: (root: RootT, ctx: GqlContext) => Promise<RestResponse>,
  propName: K
) => {
  // we return resolver
  return async (
    root: RootT,
    _: unknown,
    context: GqlContext
  ): Promise<RestResponse[K]> => {
    const item = await getItem(root, context);
    return item[propName];
  };
};

/**
 * tvmaze API does not return totalCount to listing responses. This util will
 * create resolver, that returns pagination metadata from returned items list.
 *
 * It is VERY simplified compared to normal use cases, but there are just so many
 * different pagination styles..
 */
export const listMetaResolver = <RootT>(
  getItems: (root: RootT, ctx: GqlContext) => ResourceList
) => {
  // we return resolver
  return async (
    root: RootT,
    _args: unknown,
    context: GqlContext
  ): Promise<ListMeta> => {
    const ids = await getItems(root, context);
    return {
      totalCount: ids.length,
    };
  };
};

/////////
// Types

/** Resolver returns either value or a promise */
type ResolverFnReturnType<T> = T | Promise<T>;

/** Type of resolver funcion. Usuall `(root, args, context, info) => something` */
type IFieldResolver<RootType, TReturnType, TArgs = Record<string, any>> = (
  source: RootType,
  args: TArgs,
  context: GqlContext,
  info: GraphQLResolveInfo
) => ResolverFnReturnType<TReturnType>;

/**
 * We resolve the object based on generated schema typings
 * (minus '__typename' that is added by framework).
 * We can also override property types if needed.
 */
type MergeResolverTypes<T, Overrides> = Overrides &
  Omit<T, keyof Overrides | "__typename">;

/**
 * All keys that the resolver object should contain.
 * We add Required<> to make sure even optional properties have the resolver.
 */
type ResolverKeys<T, Overrides> = keyof Required<
  MergeResolverTypes<T, Overrides>
>;

/**
 * Create type for resolver object.
 *
 * @param RootType type of `root`/`parent` argument in resolver function.
 * @param T type of the object we write resolver for
 * @param Overrides override typings generated from `T` param. You will use it when object has relations to other schema types (both 1:1 and 1:N). In this case You do not return objects themselves, but the IDs that other resolvers will use.
 *
 * Example usage:
 * ```
 * import { RootType as SeasonsListType } from "../../Season/types/SeasonsList";
 * import { RootType as ShowCharactersListType } from "../../ShowCharacter/types/ShowCharactersList";
 *
 * ...
 *
 * type ResolverType = BaseResolverType<RootType, Show, {
 *   id: ID;
 *   seasons: SeasonsListType;
 *   cast: ShowCharactersListType;
 * }>;
 * ```
 */
export type BaseResolverType<
  RootType,
  T,
  Overrides extends Partial<Record<keyof T, any>> = {} // eslint-disable-line @typescript-eslint/ban-types
> = {
  // map resolver keys to resolver funcions
  [k in ResolverKeys<T, Overrides>]: IFieldResolver<
    RootType,
    MergeResolverTypes<T, Overrides>[k]
  >;
};

/** Lists always have similar types. Generate resolver type for them. */
export type PaginatedResolver<RootType, TNode = ID> = {
  node: IFieldResolver<RootType, TNode[]>;
  meta: IFieldResolver<RootType, ListMeta>;
};
