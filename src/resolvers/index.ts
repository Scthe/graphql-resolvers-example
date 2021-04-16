import { IResolverObject, IResolvers } from "apollo-server";
import personResolver from "./Person";

const resolvers: Array<IResolvers> = [personResolver as IResolvers<any, any>];

export default resolvers;
