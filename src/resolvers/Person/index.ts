import { IResolvers } from "apollo-server";

import PersonQuery from "./queries/Person";
import PeopleQuery from "./queries/People";
import Person from "./types/Person";
import PeoplesList from "./types/PeoplesList";

export default {
  Query: {
    person: PersonQuery,
    people: PeopleQuery,
  },
  Person,
  PeoplesList,
} as IResolvers<any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
