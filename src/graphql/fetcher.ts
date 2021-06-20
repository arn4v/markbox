import * as React from "react";
import axios from "redaxios";
import { useAuth } from "~/components/AuthProvider";

export function useFetch<TData = null, TVariables = null>(
	query: string,
	variables?: TVariables,
): () => Promise<TData> {
	const { isAuthenticated } = useAuth();

	return React.useMemo(
		() => async () => {
			try {
				const res = await axios.post(
					"/api/graphql",
					{
						query,
						variables,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				return res.data;
			} catch (err) {
				throw new Error(err);
			}
		},
		[query, variables, isAuthenticated],
	);
}
