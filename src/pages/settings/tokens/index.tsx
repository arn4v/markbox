import { useRouter } from "next/router";
import { useGetAllTokensQuery } from "~/graphql/types.generated";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";
import Token from "~/modules/settings/components/Token";

export default function TokensPage() {
	const router = useRouter();
	const { data } = useGetAllTokensQuery();

	return (
		<SettingsPageWrapper>
			<div className="flex flex-col flex-grow gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12">
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
					{data?.tokens.map((data) => {
						return <Token key={data.id} data={data} />;
					})}
				</div>
			</div>
		</SettingsPageWrapper>
	);
}
