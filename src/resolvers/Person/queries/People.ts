import { QueryPeopleArgs } from "typingsGql";
import { RootType as PersonsListRoot } from "../types/PeoplesList";

export default (_root: unknown, args: QueryPeopleArgs): PersonsListRoot => ({
  name: args.name || "",
});
