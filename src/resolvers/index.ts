import { IResolvers } from "apollo-server";

import showResolver from "./Show";
import seasonResolver from "./Season";
import episodeResolver from "./Episode";
import personResolver from "./Person";
import showCharacterResolver from "./ShowCharacter";

const resolvers: Array<IResolvers> = [
  showResolver,
  seasonResolver,
  episodeResolver,
  personResolver,
  showCharacterResolver,
];

export default resolvers;
