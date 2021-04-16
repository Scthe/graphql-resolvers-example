import fs from "fs";
import path from "path";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

import { createContext } from "./GqlContext";
import resolvers from "./resolvers";
import dataSources from "./dataLoaders";

const port = 8080;
const gqlEndpoint = "/graphql";

// set up apollo server
const SCHEMA_FILE_PATH = path.join(__dirname, "./schema.graphql");
const typeDefs = gql(fs.readFileSync(SCHEMA_FILE_PATH, { encoding: "utf8" }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: createContext,
  // logger: {
  // debug: () => {},
  // info: () => {},
  // warn: () => {},
  // error: e => console.log(e)
  // },
  introspection: true,
  playground: true,
  debug: true,
});

// set up express with apollo server
const app = express();
server.applyMiddleware({ app, path: gqlEndpoint });

// start the server
app.listen(port, () => console.info(`Server started on port ${port}`));
