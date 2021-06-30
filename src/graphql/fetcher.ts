import axios from "redaxios";

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

		if (res.data.errors) {
			throw res.data.errors;
		}

		return res.data.data;
	};
};
