export enum SwapiResourceType {
  People = "people",
  Films = "films",
  Starships = "starships",
  Vehicles = "vehicles",
  Species = "species",
  Planets = "planets",
}

export type SwapiErrorResp = {
  message: 'not found',
};

export type SwapiSingleResourceResp<T> = {
  message: 'ok';
  result: T;
} | SwapiErrorResp;

export type SwapiArrayResp<T> = {
  message: 'ok';
  total_records: number;
  total_pages: number;
  previous: string | null,
  next: string | null,
  results: T[];
} | SwapiErrorResp;


export interface SwapiSingleObject<T extends object> {
  properties: T,
  description: string,
  _id: string,
  uid: string,
  __v: number
}

/*** Describes single object returned from the API  */
// export type SwapiObjectResponse<T extends object> = SwapiResponse<SwapiSingleObject<T>>


/// Person
export interface SwapiPerson {
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  created: string;
  edited: string;
  name: string;
  homeworld: string;
  url: string;
  films: string[];
  starships: string[];
}

export interface SwapiPersonListItem {
  uid: string,
  name: string,
  url: string
}