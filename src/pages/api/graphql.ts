import { ApolloServer } from "apollo-server-micro";
import { isProd } from "~/config";
import schema from "~/graphql/schema";
import { withCookies, prisma, createHandler } from "~/lib/utils.server";
import GQLContext from "~/types/GQLContext";

const apolloServer = new ApolloServer({
	schema: schema,
	playground: !isProd,
	context: ({ req, res }: GQLContext) => {
		return { req, res, prisma };
	},
});

export const config = {
	api: {
		bodyParser: false,
	},
};

const graphqlHandler = apolloServer.createHandler({ path: "/api/graphql" });

export default withCookies(createHandler().all(graphqlHandler));
