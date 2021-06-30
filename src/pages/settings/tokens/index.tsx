import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import {
	useDeleteTokenMutation,
	useGetAllTokensQuery,
} from "~/graphql/types.generated";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function TokensPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data } = useGetAllTokensQuery();
	const { mutate } = useDeleteTokenMutation({
		onSuccess(data) {
			queryClient.invalidateQueries("GetAllTokens");
		},
	});

	return (
		<SettingsPageWrapper>
			<div className="flex flex-col flex-grow gap-8 pl-12">
				<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
					<span className="text-xl font-bold">Personal access tokens</span>
					<button
						className="flex items-center px-4 py-1 mt-auto text-sm font-medium text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
						onClick={() => router.push("/settings/tokens/new")}
					>
						Generate new token
					</button>
				</div>
				<div className="flex flex-col divide-y rounded-lg dark:divide-blueGray-400 dark:bg-blueGray-700">
					{data?.tokens.map((item) => {
						return (
							<div
								key={item.id}
								className="flex items-center justify-between px-4 py-4"
							>
								{item.name}
								<button
									className="px-2 py-1 text-sm font-medium text-red-500 transition rounded hover:text-white bg-blueGray-600 hover:bg-red-500"
									onClick={() => mutate({ id: item.id })}
								>
									Delete
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</SettingsPageWrapper>
	);
}
