import Link from "next/link";
import React from "react";
import { HiCog, HiLogout, HiMenu } from "react-icons/hi";
import Drawer, { DrawerContent } from "~/components/Drawer";
import { useAuth } from "~/hooks/use-auth";
import useDisclosure from "~/hooks/use-disclosure";
import CreateBookmarkButton from "./CreateBookmarkButton";

export default function MobileMenu(): JSX.Element {
	const { user } = useAuth();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const {
		isOpen: isCreateOpen,
		onOpen: onCreateOpen,
		onClose: onCreateClose,
	} = useDisclosure();

	React.useEffect(() => {
		console.log(isCreateOpen);
	}, [isCreateOpen]);

	return (
		<>
			<button
				onClick={() => {
					onCreateClose();
					onOpen();
				}}
				className="focus:outline-none">
				<HiMenu className="h-6 w-6" />
			</button>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent
					placement="bottom"
					className="w-full h-auto dark:bg-blueGray-700 rounded-t-lg py-6">
					<ul className="flex flex-col text-base w-full px-6 gap-4">
						<CreateBookmarkButton
							className="bg-blueGray-600 z-50 relative"
							isOpen={isCreateOpen}
							onOpen={() => {
								onCreateOpen();
								onClose();
							}}
							onClose={() => {
								onOpen();
								onCreateClose();
							}}
						/>
					</ul>
					<ul className="flex flex-col text-base w-full px-6 gap-4 mt-4 pt-4 border-t border-blueGray-400">
						<li className="px-2 py-2 rounded-lg bg-blueGray-600 whitespace-nowrap text-center">
							Signed in as <br />
							{user?.email}
						</li>
						<li className="w-full">
							<Link href="/settings">
								<a className="px-2 py-2 rounded-lg bg-blueGray-600 whitespace-nowrap text-center flex gap-2 items-center justify-center">
									Settings <HiCog />
								</a>
							</Link>
						</li>
						<li className="w-full">
							<a
								className="px-2 py-2 rounded-lg bg-blueGray-600 whitespace-nowrap text-center flex gap-2 items-center justify-center"
								href="/api/auth/logout">
								Logout <HiLogout />
							</a>
						</li>
					</ul>
				</DrawerContent>
			</Drawer>
		</>
	);
}
