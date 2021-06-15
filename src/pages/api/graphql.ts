import { ApolloServer } from "apollo-server-micro";
import { isProd } from "~/constants";
import resolvers from "~/graphql/resolvers";
import typeDefs from "~/graphql/typeDefs";
import GQLContext from "~/types/GQLContext";

const apolloServer = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  playground: !isProd,
  context: ({ req, res }: GQLContext) => ({ req, res }),
});

export default apolloServer.createHandler({ path: "/api/graphql" });
