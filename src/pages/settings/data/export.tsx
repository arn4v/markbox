import { NextSeo } from "next-seo";
import React from "react";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

const ExportPage = () => {
	return (
		<SettingsPageWrapper>
			<NextSeo title="Export bookmarks" noindex />
			<div className="flex flex-col flex-grow w-full gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12">
				<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
					<span className="text-xl font-bold">Export bookmarks</span>
				</div>
				<div className="flex flex-col bg-gray-100 divide-y rounded-lg dark:divide-blueGray-400 dark:bg-gray-900"></div>
			</div>
		</SettingsPageWrapper>
	);
};

export default ExportPage;
