import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

const SidebarItem = ({ href, children }) => {
	const router = useRouter();
	const active = router.pathname === href;
	return (
		<Link href={href}>
			<a
				className={clsx([
					"px-4 py-2 w-full transition focus:outline-none hover:bg-gray-300 dark:text-white dark:hover:bg-blueGray-600 font-medium",
					active &&
						"border-l-4 border-gray-400 bg-gray-300 dark:bg-blueGray-600 dark:border-blueGray-400",
				])}
			>
				{children}
			</a>
		</Link>
	);
};

const Sidebar: Component = () => {
	const router = useRouter();

	return (
		<div className="w-full lg:w-1/4">
			<div
				id="wrapper"
				className="flex flex-col w-full mb-4 overflow-hidden text-sm bg-gray-100 rounded-lg dark:bg-blueGray-700"
			>
				<div className="w-full px-4 py-2">
					<span className="font-medium dark:text-gray-200">
						Account settings
					</span>
				</div>
				<span className="w-full h-px dark:bg-blueGray-500" />
				<div className="flex flex-col w-full">
					<SidebarItem href="/settings/account">Profile</SidebarItem>
					<span className="h-px dark:bg-blueGray-500" />
					<SidebarItem href="/settings/security">Security</SidebarItem>
				</div>
			</div>
			<div
				id="wrapper"
				className="flex flex-col w-full mb-4 overflow-hidden text-sm bg-gray-100 rounded-lg dark:bg-blueGray-700"
			>
				<div className="w-full px-4 py-2">
					<span className="font-medium dark:text-gray-200">
						Developer settings
					</span>
				</div>
				<span className="w-full h-px dark:bg-blueGray-500" />
				<div className="flex flex-col w-full">
					<SidebarItem href="/settings/tokens">Tokens</SidebarItem>
					<span className="h-px dark:bg-blueGray-500" />
					<SidebarItem href="/settings/tokens/new">
						Generate new token
					</SidebarItem>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
