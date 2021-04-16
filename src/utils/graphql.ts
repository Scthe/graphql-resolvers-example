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
