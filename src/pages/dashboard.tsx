import * as React from "react";
import { useAuth } from "~/providers/AuthProvider";
import { Logo } from "~/components/Logo";
import CreateBookmarkButton from "~/modules/dashboard/components/CreateBookmarkButton";
import Collections from "~/components/Collections";
import Navbar from "~/modules/dashboard/components/Navbar";
import LoadingPage from "~/components/LoadingPage";
import ProfileDropdown from "~/modules/common/components/ProfileDropdown";

export default function HomePage() {
	const { isLoading } = useAuth(true);

	if (isLoading) <LoadingPage />;

	return (
		<div className="h-screen w-screen bg-blueGray-50 dark:bg-blueGray-800 flex overflow-hidden">
			<div className="w-full mx-auto h-full">
				<div className="h-full w-1/6 px-6 shadow-xl dark:shadow-none bg-white dark:bg-transparent border-r border-gray-400 dark:border-gray-700 flex flex-col py-8 gap-6 justify-between items-center">
					<div className="w-full">
						<Logo className="fill-current text-black dark:text-white" />
						<Collections />
					</div>
					<div className="w-full gap-4 flex flex-col">
						<CreateBookmarkButton />
						<ProfileDropdown />
					</div>
				</div>
				<div className="h-full flex-grow flex flex-col">
					<Navbar />
				</div>
			</div>
		</div>
	);
}
