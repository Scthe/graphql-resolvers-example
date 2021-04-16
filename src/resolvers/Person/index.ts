import PersonQuery from "./queries/Person";
import PeopleQuery from "./queries/People";
import Person from "./Person";

export default {
  Query: {
    person: PersonQuery,
    people: PeopleQuery,
  },
  Person,
};
