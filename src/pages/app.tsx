import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import * as React from "react";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import { AppLayout } from "~/layouts/App";

const DashboardPage = () => {
	const router = useRouter();

	const tag = React.useMemo(() => {
		return (router.query?.tag as string) ?? "All";
	}, [router.query?.tag]);

	const { isLoading, isAuthenticated } = useAuth(true);

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<>
			<NextSeo title="Dashboard" noindex />
			<AppLayout tag={tag} />
		</>
	);
};

export default DashboardPage;
