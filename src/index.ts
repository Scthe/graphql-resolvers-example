import express from "express";
import chalk from "chalk";
import { ApolloServer } from "apollo-server-express";

import { createContext } from "./GqlContext";
import resolvers from "./resolvers";
import dataSources from "./dataSources";
import log from "./utils/log";
import { loggingPlugin, stitchSchema } from "./utils/graphql";

const port = 8080;
const gqlEndpoint = "/graphql";

// set up apollo server
const server = new ApolloServer({
  typeDefs: stitchSchema(__dirname),
  resolvers,
  dataSources,
  context: createContext,
  introspection: true,
  playground: true,
  debug: true,
  plugins: [loggingPlugin],
  logger: {
    debug: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    info: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    warn: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    error: (e) => console.error(e),
  },
});

// setup express
const app = express();
// eslint-disable-next-line @typescript-eslint/ban-types
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
