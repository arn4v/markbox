import { ApolloServer } from "apollo-server-micro";
import { isProd } from "~/constants";
import schema from "~/graphql/schema";
import withCookies from "~/lib/cookie";
import GQLContext from "~/types/GQLContext";

const apolloServer = new ApolloServer({
	schema: schema,
	playground: !isProd,
	context: ({ req, res }: GQLContext) => {
		return { req, res };
	},
});

export const config = {
	api: {
		bodyParser: false,
	},
};

const handler = apolloServer.createHandler({ path: "/api/graphql" });

export default withCookies(handler);
