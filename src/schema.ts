import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

// ** : 모든 폴더
// * : 모든 파일
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.{ts,js}`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.{ts,js}`);

export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers = mergeResolvers(loadedResolvers);

// const schema = makeExecutableSchema({ typeDefs, resolvers });

// export default schema;
