import fs from "fs";
import path from "path";
import glob from "glob";
import { gql } from "apollo-server-express";
import { GraphQLResolveInfo } from "graphql";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { DocumentNode } from "graphql";
import chalk from "chalk";

import { ListMeta } from "typingsGql";
import GqlContext from "../GqlContext";
import log from "./log";

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
    _: any,
    context: GqlContext
  ): Promise<RestResponse[K]> => {
    const item = await getItem(root, context);
    return item[propName];
  };
};

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
  sufix: string = ".graphql"
): DocumentNode[] => {
  const schemaFiles = glob.sync(`${rootDir}/**/*${sufix}`);
  return schemaFiles.map((filePath) =>
    gql(fs.readFileSync(filePath, { encoding: "utf8" }))
  );
};

/////////
// Types:

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
  Overrides extends Partial<Record<keyof T, any>> = {}
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
