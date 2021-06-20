import * as React from "react";
import axios from "redaxios";
import { useAuth } from "~/components/AuthProvider";
import { useTokenStore } from "~/components/TokenProvider";

export function useFetch<TData = null, TVariables = null>(
	query: string,
	variables?: TVariables,
): (variables?: TVariables) => Promise<TData> {
	const { isAuthenticated } = useAuth();
	const { accessToken } = useTokenStore();

	return React.useMemo(
		() => async (_variables?) => {
			try {
				const res = await axios.post(
					"/api/graphql",
					{
						query,
						variables: _variables,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					},
				);
				return res.data.data;
			} catch (err) {
				throw new Error(err);
			}
		},
		[query, variables, isAuthenticated],
	);
}

export const fetcher = <TData, TVariables>(
	query: string,
	variables?: TVariables,
): (() => Promise<TData>) => {
	return async () => {
		const res = await axios.post(
			"/api/graphql",
			{
				query,
				variables: variables ?? {},
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			},
		);

		return res.data.data;
	};
};
