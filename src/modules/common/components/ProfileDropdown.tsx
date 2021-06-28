import * as React from "react";
import { HiLogout, HiOutlineChevronDown } from "react-icons/hi";
import Popup from "~/components/Popup";
import useDisclosure from "~/hooks/use-disclosure";
import { HiCog } from "react-icons/hi";
import Link from "next/link";
import { useAuth } from "~/hooks/use-auth";

const ProfileDropdown = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user } = useAuth();

	return (
		<Popup
			id="dropdownMenuButton"
			isOpen={isOpen}
			onDismiss={onClose}
			className="bottom-0 flex flex-col gap-2"
			placement="bottom-start"
			trigger={
				<button
					onClick={isOpen ? onClose : onOpen}
					data-toggle="dropdown"
					aria-expanded={isOpen}
					aria-haspopup={true}
					className="w-full text-white font-medium items-center justify-center hover:bg-blueGray-600 flex px-2 py-2 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg gap-2 focus:outline-none">
					Account
					<HiOutlineChevronDown />
				</button>
			}>
			<ul
				aria-labelledby="dropdownMenuButton"
				className="bg-blueGray-600 rounded-md mt-2 border border-blueGray-500 w-56">
				<li className="px-4 py-2 border-b border-blueGray-400 whitespace-nowrap text-center">
					Signed in as <br /> {user?.email}
				</li>
				<li className="w-full">
					<Link href="/settings">
						<a className="py-2 border-b border-blueGray-400 dark:hover:bg-blueGray-500 flex transition gap-2 items-center w-full justify-center focus:outline-none">
							Settings <HiCog />
						</a>
					</Link>
				</li>
				<li className="w-full">
					<Link href="/api/auth/logout">
						<a className="py-2 dark:hover:bg-blueGray-500 flex transition gap-2 items-center w-full justify-center focus:outline-none">
							Logout <HiLogout />
						</a>
					</Link>
				</li>
			</ul>
		</Popup>
	);
};

export default ProfileDropdown;
