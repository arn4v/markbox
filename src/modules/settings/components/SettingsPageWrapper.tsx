import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import * as React from "react";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import Navbar from "~/modules/dashboard/components/Navbar";
import Sidebar from "~/modules/settings/components/Sidebar";
import useStore from "~/modules/settings/store";

const SettingsPageWrapper: Component<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isLoading, isAuthenticated } = useAuth(true);
	const router = useRouter();

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<div className="w-screen min-h-screen overflow-x-hidden dark:bg-blueGray-800">
			<Navbar />
			<div className="flex items-center w-full h-full mx-auto 2xl:w-3/5">
				<Sidebar />
				{children}
			</div>
		</div>
	);
};

export default SettingsPageWrapper;
