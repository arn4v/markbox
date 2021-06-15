import { ApolloServer } from "apollo-server-micro";
import { isProd } from "~/constants";
import schema from "~/graphql/schema";
import GQLContext from "~/types/GQLContext";

const apolloServer = new ApolloServer({
  schema: schema,
  playground: !isProd,
  context: ({ req, res }: GQLContext) => ({ req, res }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
