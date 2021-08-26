import { QueryPeopleArgs, QueryResolvers } from "typingsGql";

const resolver: QueryResolvers["people"] = (
  _root: unknown,
  args: QueryPeopleArgs
) => ({
  name: args.name || "",
});

export default resolver;
