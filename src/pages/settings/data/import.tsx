import clsx from "clsx";
import { NextSeo } from "next-seo";
import React from "react";
import axios from "redaxios";
import { HiUpload, HiX } from "react-icons/hi";
import { useMutation } from "react-query";
import Modal, { ModalContent } from "~/components/Modal";
import Spinner from "~/components/Spinner";
import useDisclosure from "~/hooks/use-disclosure";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";
import Netscape from "~/modules/import/components/Netscape";
import BookmarkyJson from "~/modules/import/components/BookmarkyJson";

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
						<BookmarkyJson />
					</div>
				</div>
			</SettingsPageWrapper>
		</>
	);
};

export default ImportPage;
