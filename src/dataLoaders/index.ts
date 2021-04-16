// import { Config, GraphQLServerOptions, DataSource } from "apollo-server"
// import { Config, GraphQLServerOptions, DataSource } from "apollo-datasource"
import GqlContext from "GqlContext";
import PersonAPI from "./PersonAPI";

// type DataSources<T> = NonNullable<Config<T, any>["dataSources"]>;

const dataSources = () => {
  return {
    personAPI: new PersonAPI(),
  };
};

export type DataSources = ReturnType<typeof dataSources>;

export default dataSources;
