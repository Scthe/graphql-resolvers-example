import { IResolvers } from "apollo-server";

import ShowQuery from "./queries/Show";
import ShowByImdbQuery from "./queries/ShowByImdb";
import ShowsQuery from "./queries/Shows";
import Show from "./types/Show";
import ShowsList from "./types/ShowsList";

export default {
  Query: {
    show: ShowQuery,
    shows: ShowsQuery,
    showByIMDB: ShowByImdbQuery,
  },
  Show,
  ShowsList,
} as IResolvers<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
