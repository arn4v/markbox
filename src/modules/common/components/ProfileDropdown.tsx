import * as React from "react";
import {
	HiLogout,
	HiOutlineChevronDown,
	HiTemplate,
	HiCog,
} from "react-icons/hi";
import Popup from "~/components/Popup";
import useDisclosure from "~/hooks/use-disclosure";
import Link from "next/link";
import { useAuth } from "~/hooks/use-auth";
import { useRouter } from "next/router";

const ProfileDropdown = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user } = useAuth();
	const router = useRouter();

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
					className="flex items-center justify-center w-full gap-2 px-2 py-2 font-medium text-white transition duration-150 ease-in-out rounded-lg hover:bg-blueGray-600 bg-blueGray-700 focus:outline-none"
				>
					Account
					<HiOutlineChevronDown />
				</button>
			}
		>
			<ul
				aria-labelledby="dropdownMenuButton"
				className="w-56 mt-2 border rounded-md bg-blueGray-600 border-blueGray-500"
			>
				<li className="px-4 py-2 text-center border-b border-blueGray-400 whitespace-nowrap">
					Signed in as <br /> {user?.email}
				</li>
				<li className="w-full">
					{router.pathname === "/dashboard" ? (
						<Link href="/settings/account">
							<a className="flex items-center justify-center w-full gap-2 py-2 transition border-b border-blueGray-400 dark:hover:bg-blueGray-500 focus:outline-none">
								Settings <HiCog />
							</a>
						</Link>
					) : (
						<Link href="/dashboard">
							<a className="flex items-center justify-center w-full gap-2 py-2 transition border-b border-blueGray-400 dark:hover:bg-blueGray-500 focus:outline-none">
								Dashboard <HiTemplate />
							</a>
						</Link>
					)}
				</li>
				<li className="w-full">
					<Link href="/api/auth/logout">
						<a className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-blueGray-500 focus:outline-none">
							Logout <HiLogout />
						</a>
					</Link>
				</li>
			</ul>
		</Popup>
	);
};

export default ProfileDropdown;
