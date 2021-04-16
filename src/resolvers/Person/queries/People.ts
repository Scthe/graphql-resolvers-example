import { QueryPeopleArgs } from "typingsGql";
import GqlContext from "GqlContext";

export default async (_root: any, args: QueryPeopleArgs, context: GqlContext): Promise<ID[]> => {
  const ids = context.dataSources.personAPI.getPeopleByName(args.name || "");
  return ids;
};
