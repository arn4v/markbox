import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import * as React from "react";
import Breadcrumbs from "~/components/Breadcrumbs";
import LoadingPage from "~/components/LoadingPage";
import { useAuth } from "~/hooks/use-auth";
import Navbar from "../dashboard/components/Navbar";
import AccountTab from "./components/AccountTab";
import ApiKeysTab from "./components/ApiKeysTab";
import Sidebar from "./components/Sidebar";
import useStore from "./store";

const SettingsPage: Component = () => {
	const { isLoading, isAuthenticated } = useAuth();
	const [tab, setTab] = useStore((state) => [state.tab, state.setTab]);
	const router = useRouter();

	if (isLoading || !isAuthenticated) return <LoadingPage />;

	return (
		<>
			<div className="w-screen min-h-screen overflow-x-hidden dark:bg-blueGray-800">
				<Navbar />
				<div className="flex items-center w-full h-full mx-auto 2xl:w-3/5">
					<Sidebar />
					{tab === "account" && <AccountTab />}
					{tab === "api_keys" && <ApiKeysTab />}
				</div>
			</div>
		</>
	);
};

export default dynamic(Promise.resolve(SettingsPage), { ssr: false });
