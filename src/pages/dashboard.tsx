import * as React from "react";
import { useAuth } from "~/providers/AuthProvider";
import { Logo } from "~/components/Logo";
import CreateBookmarkButton from "~/modules/dashboard/components/CreateBookmarkButton";
import Navbar from "~/modules/dashboard/components/Navbar";
import LoadingPage from "~/components/LoadingPage";
import ProfileDropdown from "~/modules/common/components/ProfileDropdown";
import dynamic from "next/dynamic";
import Tags from "~/modules/dashboard/components/Tags";
import BookmarksGrid from "~/modules/dashboard/components/BookmarksGrid";

const DashboardPage = () => {
	const { isLoading } = useAuth(true);

	if (isLoading) <LoadingPage />;

	return (
		<div className="h-screen w-screen bg-blueGray-50 dark:bg-blueGray-800 flex overflow-hidden">
			<div className="w-3/5 mx-auto h-full flex">
				<div className="h-full w-1/4 px-6 shadow-xl dark:shadow-none bg-white dark:bg-transparent border-r border-gray-400 dark:border-gray-700 flex flex-col py-8 gap-6 justify-between items-center">
					<div className="w-full">
						<Logo className="fill-current text-black dark:text-white" />
						<Tags />
					</div>
					<div className="w-full gap-4 flex flex-col">
						<CreateBookmarkButton />
						<ProfileDropdown />
					</div>
				</div>
				<div className="h-full flex-grow flex p-8 flex-col">
					<Navbar />
					<BookmarksGrid />
				</div>
			</div>
		</div>
	);
};

const DashboardPageCSR = dynamic(Promise.resolve(DashboardPage), {
	ssr: false,
});

export default DashboardPageCSR;
