import * as React from "react";
import { useAuth } from "~/providers/AuthProvider";
import Navbar from "~/modules/dashboard/components/Navbar";
import LoadingPage from "~/components/LoadingPage";
import dynamic from "next/dynamic";
import BookmarksGrid from "~/modules/dashboard/components/BookmarksGrid";
import Sidebar from "~/modules/dashboard/components/Sidebar";

const DashboardPage = () => {
	const { isLoading } = useAuth(true);

	if (isLoading) <LoadingPage />;

	return (
		<div className="h-screen w-screen bg-blueGray-50 dark:bg-blueGray-800 flex flex-col overflow-hidden">
			<Navbar />
			<div className="w-3/5 mx-auto h-full flex">
				<Sidebar />
				<div className="h-full flex-grow flex p-8 flex-col">
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
