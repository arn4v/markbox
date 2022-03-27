import { NextSeo } from "next-seo";
import * as React from "react";
import { AppLayout } from "~/components/AppLayout";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import BookmarksGrid from "~/modules/dashboard/components/BookmarksGrid";

const DashboardPage = () => {
	const { isLoading, isAuthenticated } = useAuth(true);

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<>
			<NextSeo title="Dashboard" noindex />
			<AppLayout>
				{isLoading || !isAuthenticated ? null : <BookmarksGrid />}
			</AppLayout>
		</>
	);
};

export default DashboardPage;
