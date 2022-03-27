import clsx from "clsx";
import * as React from "react";
import { useAuth } from "~/hooks/use-auth";
import Sidebar from "~/modules/dashboard/components/Sidebar";

export function AppLayout({
	children,
	...props
}: { children: React.ReactNode } & JSX.IntrinsicElements["div"]) {
	const { isLoading, isAuthenticated } = useAuth(true);

	return (
		<div
			{...props}
			className={clsx(
				"flex flex-col w-screen min-h-screen bg-white dark:bg-black",
				props.className,
			)}
		>
			{/* <Navbar /> */}
			<div className="flex flex-col w-full h-full mx-auto 2xl:w-3/5">
				<div>
					<Sidebar />
					<div className="lg:ml-72">{children}</div>
				</div>
			</div>
		</div>
	);
}
