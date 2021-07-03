import { NextSeo } from "next-seo";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import BookmarksGrid from "./components/BookmarksGrid";
import { CreateBookmarkDrawer } from "./components/CreateBookmark";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const DashboardPage = () => {
	const { isLoading, isAuthenticated } = useAuth(true);

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<>
			<NextSeo title="Dashboard" noindex />
			<div className="flex flex-col w-screen h-screen overflow-hidden bg-white dark:bg-black">
				<Navbar />
				<div className="flex w-full h-full mx-auto 2xl:w-3/5">
					<Sidebar />
					<BookmarksGrid />
				</div>
			</div>
			<CreateBookmarkDrawer />
		</>
	);
};

export default DashboardPage;
