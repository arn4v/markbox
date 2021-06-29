import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiCog, HiLogout, HiMenu, HiOutlineTemplate } from "react-icons/hi";
import Drawer, { DrawerContent } from "~/components/Drawer";
import { useAuth } from "~/hooks/use-auth";
import useDisclosure from "~/hooks/use-disclosure";
import useStore from "./CreateBookmark";
import CreateBookmarkButton from "./CreateBookmark/CreateBookmarkButton";

export default function MenuDrawer(): JSX.Element {
	const { user } = useAuth();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { isOpen: isCreateOpen, onClose: onCreateClose } = useStore();
	const router = useRouter();

	console.log(router.pathname === "/dashboard");

	return (
		<>
			<button
				onClick={() => {
					if (isCreateOpen) onCreateClose();
					onOpen();
				}}
				className="focus:outline-none"
			>
				<HiMenu className="w-6 h-6" />
			</button>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent
					placement="bottom"
					className="w-full h-auto py-8 rounded-t-lg dark:bg-blueGray-700"
				>
					<ul
						className={clsx([
							"flex flex-col w-full gap-4 px-6 text-base",
						])}
					>
						<li className="px-2 py-2 text-center rounded-lg bg-blueGray-600 whitespace-nowrap">
							Signed in as <br />
							{user?.email}
						</li>
						<li className="w-full">
							{router.pathname === "/dashboard" ? (
								<Link href="/settings">
									<a className="flex items-center justify-center gap-2 px-2 py-2 text-center rounded-lg bg-blueGray-600 whitespace-nowrap">
										Settings <HiCog />
									</a>
								</Link>
							) : (
								<Link href="/dashboard">
									<a className="flex items-center justify-center gap-2 px-2 py-2 text-center rounded-lg bg-blueGray-600 whitespace-nowrap">
										Dashboard <HiOutlineTemplate />
									</a>
								</Link>
							)}
						</li>
						<li className="w-full">
							<a
								className="flex items-center justify-center gap-2 px-2 py-2 text-center rounded-lg bg-blueGray-600 whitespace-nowrap"
								href="/api/auth/logout"
							>
								Logout <HiLogout />
							</a>
						</li>
					</ul>
				</DrawerContent>
			</Drawer>
		</>
	);
}
