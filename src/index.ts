import fs from "fs";
import path from "path";
import express from "express";
import chalk from "chalk";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { ApolloServer, gql } from "apollo-server-express";

import GqlContext, { createContext } from "./GqlContext";
import resolvers from "./resolvers";
import dataSources from "./dataSources";
import log from "./utils/log";

const port = 8080;
const gqlEndpoint = "/graphql";

// set up apollo server
const SCHEMA_FILE_PATH = path.join(__dirname, "./schema.graphql");
const typeDefs = gql(fs.readFileSync(SCHEMA_FILE_PATH, { encoding: "utf8" }));
const loggingPlugin: ApolloServerPlugin<GqlContext> = {
  requestDidStart() {
    return {
      didResolveOperation(gqlReq) {
        const opName = gqlReq.operationName != null ? gqlReq.operationName : "unknown_operation";
        log(chalk.green.bold("GQL"), opName);
      }
    }
  }
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: createContext,
  introspection: true,
  playground: true,
  debug: true,
  plugins: [loggingPlugin],
  logger: {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: (e) => console.error(e),
  },
});


// setup express
const app = express();
app.use((req: express.Request, _res: express.Response, next: Function) => {
  log(chalk.green.bold(`\n${req.method} ${req.url}`));
  next();
});


// set up express with apollo server
server.applyMiddleware({ app, path: gqlEndpoint });

// used in tests
export default app;

// start the server if this script is executed
if (require.main === module) {
  app.listen(port, () => console.info(`Server started on port ${port}`));
}
