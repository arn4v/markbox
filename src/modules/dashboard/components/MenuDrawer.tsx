import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
	HiMenu,
	HiOutlineCog,
	HiOutlineDocumentText,
	HiOutlineLogout,
	HiOutlineTemplate,
	HiOutlineViewGrid,
	HiViewGrid,
} from "react-icons/hi";
import { useDisclosure } from "react-sensible";
import Drawer, { DrawerContent } from "~/components/Drawer";
import { useAuth } from "~/hooks/use-auth";
import { useStore } from "~/store";

const MenuItem = ({
	href,
	children,
}: {
	href: LinkProps["href"];
	children: React.ReactNode;
}) => {
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
	const {
		isOpen: isCreateOpen,
		actions: { onClose: onCreateClose },
	} = useStore((state) => state.createBookmark);
	const router = useRouter();

	return (
		<>
			<button
				onClick={() => {
					if (isCreateOpen) onCreateClose();
					onOpen();
				}}
				className="focus:outline-none dark:text-white"
			>
				<HiMenu className="h-[20px] w-[20px]" />
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
						<MenuItem href="/docs">
							Docs <HiOutlineDocumentText />
						</MenuItem>
						{router.pathname !== "/app" ? (
							<li className="w-full">
								<MenuItem href="/app">
									Dashboard <HiOutlineTemplate />
								</MenuItem>
							</li>
						) : null}
						{!router.pathname.includes("/collections") ? (
							<li className="w-full">
								<MenuItem href="/collections">
									Collections <HiOutlineViewGrid />
								</MenuItem>
							</li>
						) : null}
						{!router.pathname.includes("/settings") ? (
							<li className="w-full">
								<MenuItem href="/settings/account">
									Settings <HiOutlineCog />
								</MenuItem>
							</li>
						) : null}
						<li className="w-full">
							<MenuItem href="/api/auth/logout">
								Logout <HiOutlineLogout />
							</MenuItem>
						</li>
					</ul>
				</DrawerContent>
			</Drawer>
		</>
	);
}
