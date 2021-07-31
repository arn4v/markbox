import { ApolloServer } from "apollo-server-micro";
import schema from "~/graphql/schema";
import { createHandler, prisma, withCookies } from "~/lib/utils.server";
import GQLContext from "~/types/GQLContext";

const apolloServer = new ApolloServer({
	schema: schema,
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
