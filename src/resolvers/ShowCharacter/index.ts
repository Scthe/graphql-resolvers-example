import { IResolvers } from "apollo-server";

import ShowCharacter from "./types/ShowCharacter";
import ShowCharactersList from "./types/ShowCharactersList";

export default {
  ShowCharacter,
  ShowCharactersList,
} as IResolvers<any, any>;
