import { IResolvers } from "apollo-server";
import showResolver from "./Show";
import seasonResolver from "./Season";
import episodeResolver from "./Episode";

const resolvers: Array<IResolvers> = [
  showResolver,
  seasonResolver,
  episodeResolver,
];

export default resolvers;
