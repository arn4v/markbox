import { useRouter } from "next/router";
import * as React from "react";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import Navbar from "~/modules/dashboard/components/Navbar";
import Sidebar from "~/modules/settings/components/Sidebar";

const SettingsPageWrapper: Component<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isLoading, isAuthenticated } = useAuth(true);
	const router = useRouter();

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<div className="w-screen h-screen overflow-x-hidden dark:bg-black dark:text-white">
			<Navbar />
			<div className="flex flex-col items-start w-full h-full px-4 pt-8 pb-4 mx-auto antialiased 2xl:px-0 lg:flex-row 2xl:w-3/5">
				<Sidebar />
				{children}
			</div>
		</div>
	);
};

export default SettingsPageWrapper;
