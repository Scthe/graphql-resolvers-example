import { SwapiPerson, SwapiResourceType } from "./swapiTypes";
import SwapiResource, { ResourceList } from "./SwapiResource";

export interface Person {
  id: ID;
  name: string;
  height: number;
  mass: number;
  birth_year: string;
  gender: string;
  homeworld: ID;
  films: ID[];
  starships: ID[];
}

export default class PersonAPI extends SwapiResource<SwapiPerson, Person> {
  constructor() {
    super(SwapiResourceType.People);
  }

  getOne = (id: ID): Promise<Person> => this.getById(id);

  getPeopleByName = (name: string): ResourceList => { // TODO findByName or whatever apollo-server does
    console.log("getPeopleByName", name)
    // https://www.swapi.tech/api/people/?name=r2
    return this.findMany({ name });
  };

  protected adaptData = (data: SwapiPerson): Person => ({
    id: this.parseId(data.url),
    name: data.name,
    height: parseInt(data.height, 10),
    mass: parseInt(data.mass, 10),
    birth_year: data.birth_year,
    gender: data.gender,
    homeworld: this.parseId(data.homeworld),
    films: this.parseArray(data.films),
    starships: this.parseArray(data.starships),
  });
}
