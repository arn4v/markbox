import { useAuth } from "~/hooks/use-auth";
import BookmarksGrid from "../modules/dashboard/components/BookmarksGrid";
import Navbar from "../modules/dashboard/components/Navbar";
import Sidebar from "../modules/dashboard/components/Sidebar";

export function AppLayout({ tag }: { tag: string }) {
	const { isLoading, isAuthenticated } = useAuth(true);

	return (
		<div className="flex flex-col w-screen min-h-screen scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scrollbar scrollbar-thin bg-white dark:bg-black">
			<Navbar />
			<div className="flex w-full h-full mx-auto 2xl:w-3/5 mt-20">
				{isLoading || !isAuthenticated ? (
					<></>
				) : (
					<>
						<Sidebar />
						<BookmarksGrid tag={tag} />
					</>
				)}
			</div>
		</div>
	);
}
