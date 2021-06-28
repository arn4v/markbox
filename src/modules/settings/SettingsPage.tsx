import dynamic from "next/dynamic";
import * as React from "react";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import Navbar from "../dashboard/components/Navbar";
import Sidebar from "./components/Sidebar";

const SettingsPage: Component = () => {
	const { isLoading, isAuthenticated } = useAuth();

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<>
			<div className="w-screen min-h-screen overflow-x-hidden dark:bg-blueGray-800">
				<Navbar />
				<div className="flex items-center w-full h-full mx-auto 2xl:w-3/5">
					<Sidebar />
				</div>
			</div>
		</>
	);
};

export default dynamic(Promise.resolve(SettingsPage), { ssr: false });
