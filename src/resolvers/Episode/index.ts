import { IResolvers } from "apollo-server";

import Episode from "./types/Episode";
import EpisodesList from "./types/EpisodesList";

export default {
  Episode,
  EpisodesList,
} as IResolvers<any, any>;
