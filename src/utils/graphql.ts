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

type IFieldResolver<RootType, TReturnType, TArgs = Record<string, any>> = (
  source: RootType,
  args: TArgs,
  context: GqlContext,
  info: GraphQLResolveInfo
) => ResolverFnReturnType<TReturnType>;

/**
 * We resolve the object based on generated schema typings.
 * Also remove '__typename' from object definition.
 * We can also override property types if needed.
 */
type MergeResolverTypes<T, Overrides> = Omit<
  T,
  keyof Overrides | "__typename"
> &
  Overrides;

type ResolverKeys<T, Overrides> = keyof Required<
  MergeResolverTypes<T, Overrides>
>;

export type BaseResolverType<
  RootType,
  T,
  Overrides extends Partial<Record<keyof T, any>> = {} // eslint-disable-line @typescript-eslint/ban-types
> = {
  // We add Required<> to make sure even optional properties have the resolver.
  [k in ResolverKeys<T, Overrides>]: IFieldResolver<
    RootType,
    MergeResolverTypes<T, Overrides>[k]
  >;
};

export type PaginatedResolver<RootType, TNode = ID> = {
  node: IFieldResolver<RootType, TNode[]>;
  meta: IFieldResolver<RootType, ListMeta>;
};
