import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar: Component = () => {
	const router = useRouter();

	return (
		<div className="w-full lg:w-1/4">
			<div
				id="wrapper"
				className="flex flex-col w-full mb-4 overflow-hidden text-sm rounded-lg bg-blueGray-700"
			>
				<div className="w-full px-4 py-2">
					<span className="font-medium dark:text-gray-200">
						Account settings
					</span>
				</div>
				<span className="w-full h-px dark:bg-blueGray-500" />
				<div className="flex flex-col w-full">
					<Link href="/settings/account">
						<a
							className={clsx([
								"px-4 py-2 w-full transition focus:outline-none",
								router.pathname === "/settings/account" &&
									"border-l-4 dark:border-blue-500",
							])}
						>
							Profile
						</a>
					</Link>
					<span className="h-px dark:bg-blueGray-500" />
					<Link href="/settings/security">
						<a
							className={clsx([
								"px-4 py-2 w-full transition focus:outline-none",
								router.pathname === "/settings/security" &&
									"border-l-4 dark:border-blue-500",
							])}
						>
							Security
						</a>
					</Link>
				</div>
			</div>
			<div
				id="wrapper"
				className="flex flex-col w-full mb-4 overflow-hidden text-sm rounded-lg bg-blueGray-700"
			>
				<div className="w-full px-4 py-2">
					<span className="font-medium dark:text-gray-200">
						Developer settings
					</span>
				</div>
				<span className="w-full h-px dark:bg-blueGray-500" />
				<div className="flex flex-col w-full">
					<Link href="/settings/tokens">
						<a
							className={clsx([
								"px-4 py-2 w-full transition focus:outline-none",
								router.pathname === "/settings/tokens" &&
									"border-l-4 dark:border-blue-500",
							])}
						>
							Tokens
						</a>
					</Link>
					<span className="h-px dark:bg-blueGray-500" />
					<Link href="/settings/tokens/new">
						<a
							className={clsx([
								"px-4 py-2 w-full transition focus:outline-none",
								router.pathname === "/settings/tokens/new" &&
									"border-l-4 dark:border-blue-500",
							])}
						>
							Generate new token
						</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
