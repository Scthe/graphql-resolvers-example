import { QueryShowArgs } from "typingsGql";
import { RootType as ShopType } from "../types/Show";
import { parseId } from "utils";

export default (_root: unknown, args: QueryShowArgs): ShopType =>
  parseId(args.id);
