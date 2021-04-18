import { IResolvers } from "apollo-server";

import Season from "./types/Season";
import SeasonsList from "./types/SeasonsList";

export default {
  Season,
  SeasonsList,
} as IResolvers<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
