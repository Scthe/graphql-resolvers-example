import { QueryPersonArgs } from "typingsGql";
import { RootType as PersonType } from "../types/Person";
import { parseId } from "utils";

export default (_root: any, args: QueryPersonArgs): PersonType =>
  parseId(args.id);
