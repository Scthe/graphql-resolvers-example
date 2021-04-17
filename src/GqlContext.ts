import { ExpressContext } from "apollo-server-express";
import express from "express";
import type { DataSources } from "./dataSources";

interface GqlContext {
  req: express.Request;
}

// need to add this manually
interface GqlContextWithDataSources extends GqlContext {
  dataSources: DataSources;
}

export default GqlContextWithDataSources;

export const createContext = (expressCtx: ExpressContext): GqlContext => {
  return {
    req: expressCtx.req,
  };
};
