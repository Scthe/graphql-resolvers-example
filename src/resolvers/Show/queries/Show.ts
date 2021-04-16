import { QueryShowArgs } from "typingsGql";
import { RootType as ShopType } from "../types/Show";

export default (_root: any, args: QueryShowArgs): ShopType => parseInt(args.id, 10) as any;
