import { QueryPersonArgs } from "typingsGql";
import { RootType as PersonType } from "../types/Person";

export default (_root: any, args: QueryPersonArgs): PersonType =>
  parseInt(args.id, 10) as any;
