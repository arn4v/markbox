import { NextSeo } from "next-seo";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

export default function AccountSecurityPage() {
	return (
		<SettingsPageWrapper>
			<NextSeo title="Security Settings" noindex />
			<div className="flex flex-col flex-grow w-full gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12 dark:text-white">
				<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
					<span className="text-xl font-bold">Security settings</span>
				</div>
				<div className="flex flex-col divide-y rounded-lg dark:divide-blueGray-400 dark:bg-blueGray-700"></div>
			</div>
		</SettingsPageWrapper>
	);
}
