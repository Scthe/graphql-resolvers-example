import { IResolvers } from "apollo-server";

import ShowQuery from "./queries/Show";
import ShowsQuery from "./queries/Shows";
import Show from "./types/Show";
import ShowsList from "./types/ShowsList";

export default {
  Query: {
    show: ShowQuery,
    shows: ShowsQuery,
  },
  Show,
  ShowsList,
} as IResolvers<any, any>;
