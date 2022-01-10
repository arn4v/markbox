import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "~/server/createContext";
import { appRouter } from "~/server/routers/_app";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
	batching: {
		enabled: false,
	},
	onError({ error, input, path }) {
		if (error.code === "INTERNAL_SERVER_ERROR") {
			// send to bug reporting
			console.error("Something went wrong", error);
		}
	},
});
