import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import BookmarksGrid from "./components/BookmarksGrid";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const DashboardPage = () => {
	const { isLoading, isAuthenticated } = useAuth(true);

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<>
			<NextSeo title="Dashboard" noindex />
			<div className="flex flex-col w-screen min-h-screen scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scrollbar scrollbar-thin bg-white dark:bg-black">
				<Navbar />
				<div className="flex w-full h-full mx-auto 2xl:w-3/5 mt-20">
					<Sidebar />
					<BookmarksGrid />
				</div>
			</div>
		</>
	);
};

export default dynamic(Promise.resolve(DashboardPage), {
	ssr: false,
});
