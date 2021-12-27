import { NextSeo } from "next-seo";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import { AppLayout } from "~/modules/dashboard/layouts/App.layout";

const DashboardPage = () => {
	const { isLoading, isAuthenticated } = useAuth(true);

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<>
			<NextSeo title="Dashboard" noindex />
			<AppLayout tag="All" />
		</>
	);
};

export default DashboardPage;
