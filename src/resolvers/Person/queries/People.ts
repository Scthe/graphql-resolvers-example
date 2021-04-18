import { QueryPeopleArgs } from "typingsGql";
import { RootType as PersonsListRoot } from "../types/PeoplesList";

export default (_root: any, args: QueryPeopleArgs): PersonsListRoot => ({
  name: args.name || "",
});
