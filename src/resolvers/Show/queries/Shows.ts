import { QueryShowsArgs } from "typingsGql";
import { RootType as ShowsListRoot } from "../types/ShowsList";

export default (_root: any, args: QueryShowsArgs): ShowsListRoot => ({
  name: args.name || "",
});
