/* External dependencies */
import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

/* Local dependencies */
import typeDefs from "./typeDefs";

const resolversArray = loadFilesSync(`${__dirname}/resolvers/*.js`);

const resolvers = mergeResolvers(resolversArray);
export { typeDefs, resolvers };
