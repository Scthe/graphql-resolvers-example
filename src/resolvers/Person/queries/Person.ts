import { QueryPersonArgs, QueryResolvers } from "typingsGql";
import { parseId } from "utils";

const resolver: QueryResolvers["person"] = (
  _root: unknown,
  args: QueryPersonArgs
) => parseId(args.id);

export default resolver;
