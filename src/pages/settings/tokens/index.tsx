import { NextSeo } from "next-seo";
import { HiArrowDown } from "react-icons/hi";
import { trpc } from "~/lib/trpc";
import GenerateTokenButton from "~/modules/settings/components/GenerateTokenButton";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";
import Token from "~/modules/settings/components/Token";

export default function TokensPage() {
	const { data } = trpc.useQuery(["tokens.all"]);

	return (
		<SettingsPageWrapper>
			<NextSeo title="Personal Access Tokens" noindex />
			<div className="flex flex-col flex-grow w-full gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12">
				<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
					<span className="text-xl font-bold">Personal access tokens</span>
					{!!data?.length && <GenerateTokenButton />}
				</div>
				<div className="flex flex-col bg-gray-100 divide-y rounded-lg dark:divide-blueGray-400 dark:bg-gray-900">
					{data?.length ? (
						data?.map((data) => {
							return <Token key={data.id} data={data} />;
						})
					) : (
						<div className="flex flex-col items-center justify-center gap-4 p-4">
							<span className="flex items-center gap-2 text-center">
								Generate your first token <HiArrowDown />
							</span>
							<GenerateTokenButton className="px-4 py-2 mx-auto" />
						</div>
					)}
				</div>
			</div>
		</SettingsPageWrapper>
	);
}
