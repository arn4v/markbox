import { NextSeo } from "next-seo";
import React from "react";
import MarkboxJson from "~/modules/import/components/MarkboxJson";
import Netscape from "~/modules/import/components/Netscape";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

const ImportPage = () => {
	return (
		<>
			<SettingsPageWrapper>
				<NextSeo title="Import bookmarks" noindex />
				<div className="flex flex-col flex-grow w-full gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12">
					<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
						<span className="text-xl font-bold">Import bookmarks</span>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<Netscape />
						<MarkboxJson />
					</div>
				</div>
			</SettingsPageWrapper>
		</>
	);
};

export default ImportPage;
