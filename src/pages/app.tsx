import { NextSeo } from "next-seo";
import * as React from "react";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import { AppLayout } from "~/layouts/App";
import BookmarksGrid from "~/modules/dashboard/components/BookmarksGrid";
import Sidebar from "~/modules/dashboard/components/Sidebar";

const DashboardPage = () => {
	const { isLoading, isAuthenticated } = useAuth(true);

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<>
			<NextSeo title="Dashboard" noindex />
			<AppLayout>
				{isLoading || !isAuthenticated ? (
					<></>
				) : (
					<div>
						<Sidebar />
						<BookmarksGrid />
					</div>
				)}
			</AppLayout>
		</>
	);
};

export default DashboardPage;
