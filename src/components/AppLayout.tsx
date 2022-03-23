import clsx from "clsx";
import * as React from "react";
import { useAuth } from "~/hooks/use-auth";
import Navbar from "../modules/dashboard/components/Navbar";

export function AppLayout({
	children,
	...props
}: { children: React.ReactNode } & JSX.IntrinsicElements["div"]) {
	const { isLoading, isAuthenticated } = useAuth(true);

	return (
		<div
			{...props}
			className={clsx(
				"flex flex-col w-screen min-h-screen scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scrollbar scrollbar-thin bg-white dark:bg-black",
				props.className,
			)}
		>
			<Navbar />
			<div className="flex flex-col w-full h-full mx-auto 2xl:w-3/5 mt-20">
				{children}
			</div>
		</div>
	);
}
