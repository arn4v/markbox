import clsx from "clsx";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
	HiCog,
	HiLogout,
	HiMenu,
	HiOutlineMoon,
	HiOutlineSun,
	HiOutlineTemplate
} from "react-icons/hi";
import Drawer, { DrawerContent } from "~/components/Drawer";
import { useAuth } from "~/hooks/use-auth";
import useDisclosure from "~/hooks/use-disclosure";
import useStore from "./CreateBookmark";

const MenuItem = ({ href, children }) => {
	return (
		<Link href={href}>
			<a className="flex items-center justify-center gap-2 px-2 py-2 text-center transition bg-gray-100 rounded-lg dark:bg-gray-600 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-current">
				{children}
			</a>
		</Link>
	);
};

export default function MenuDrawer(): JSX.Element {
	const { user } = useAuth();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { isOpen: isCreateOpen, onClose: onCreateClose } = useStore();
	const router = useRouter();
	const { setTheme, theme } = useTheme();

	return (
		<>
			<button
				onClick={() => {
					if (isCreateOpen) onCreateClose();
					onOpen();
				}}
				className="focus:outline-none dark:text-white"
			>
				<HiMenu className="w-6 h-6" />
			</button>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent
					placement="bottom"
					className="w-full h-auto py-8 text-black bg-white rounded-t-lg dark:bg-gray-900 dark:text-white"
				>
					<ul className={clsx(["flex flex-col w-full gap-4 px-6 text-base"])}>
						<li className="px-2 py-2 text-center bg-gray-100 rounded-lg dark:bg-gray-600 whitespace-nowrap">
							Signed in as <br />
							{user?.email}
						</li>
						<li className="w-full">
							{router.pathname === "/dashboard" ? (
								<MenuItem href="/settings">
									Settings <HiCog />
								</MenuItem>
							) : (
								<MenuItem href="/dashboard">
									Dashboard <HiOutlineTemplate />
								</MenuItem>
							)}
						</li>
						<li className="w-full">
							<button
								className="flex items-center justify-center w-full gap-2 py-2 transition bg-gray-100 rounded-md dark:bg-gray-600 focus:outline-none hover:bg-gray-200"
								onClick={() => {
									setTheme(theme === "dark" ? "light" : "dark");
								}}
							>
								Toggle theme
								{theme === "dark" ? <HiOutlineMoon /> : <HiOutlineSun />}
							</button>
						</li>
						<li className="w-full">
							<MenuItem href="/api/auth/logout">
								Logout <HiLogout />
							</MenuItem>
						</li>
					</ul>
				</DrawerContent>
			</Drawer>
		</>
	);
}
