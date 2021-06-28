import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import BookmarksGrid from "./components/BookmarksGrid";
import { CreateBookmarkDrawer } from "./components/CreateBookmark";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const DashboardPage = () => {
	const { isLoading } = useAuth(true);

	if (isLoading) <LoadingPage />;

	return (
		<>
			<div className="h-screen w-screen bg-blueGray-50 dark:bg-blueGray-800 flex flex-col overflow-hidden">
				<Navbar />
				<div className="w-full 2xl:w-3/5 mx-auto h-full flex">
					<Sidebar />
					<BookmarksGrid />
				</div>
			</div>
			<CreateBookmarkDrawer />
		</>
	);
};

export default DashboardPage;
