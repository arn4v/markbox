import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import {
	HiCog,
	HiLogout,
	HiOutlineChevronDown,
	HiOutlineMoon,
	HiOutlineSun,
	HiTemplate
} from "react-icons/hi";
import Popup from "~/components/Popup";
import { useAuth } from "~/hooks/use-auth";
import useDisclosure from "~/hooks/use-disclosure";

const Item = ({ href, children }) => {
	return (
		<Link href={href}>
			<a className="flex items-center justify-center w-full gap-2 py-2 transition border-b border-gray-300 dark:border-blueGray-400 dark:hover:bg-gray-500 focus:outline-none hover:bg-gray-200 dark:text-white">
				{children}
			</a>
		</Link>
	);
};

const ProfileDropdown = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user } = useAuth();
	const router = useRouter();
	const { setTheme, theme } = useTheme();

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
					className="flex items-center justify-center w-full gap-2 px-2 py-2 font-medium text-black transition duration-150 ease-in-out bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 dark:bg-gray-900 focus:outline-none dark:text-white dark:border-none"
				>
					Account
					<HiOutlineChevronDown />
				</button>
			}
		>
			<ul
				aria-labelledby="dropdownMenuButton"
				className="w-56 mt-2 bg-white border border-gray-200 rounded-md dark:bg-gray-600 dark:border-blueGray-500 dark:text-white"
			>
				<li className="px-4 py-2 text-center bg-gray-200 border-b border-gray-300 dark:bg-transparent dark:border-blueGray-400 whitespace-nowrap dark:text-white">
					Signed in as <br /> {user?.email}
				</li>
				<li className="w-full">
					{router.pathname === "/dashboard" ? (
						<Item href="/settings/account">
							Settings <HiCog />
						</Item>
					) : (
						<Item href="/dashboard">
							Dashboard <HiTemplate />
						</Item>
					)}
				</li>
				<li className="w-full">
					<button
						className="flex items-center justify-center w-full gap-2 py-2 transition border-b border-gray-300 dark:hover:bg-gray-500 focus:outline-none dark:border-blueGray-400 hover:bg-gray-200 dark:text-white"
						onClick={() => {
							setTheme(theme === "dark" ? "light" : "dark");
						}}
					>
						Toggle theme{" "}
						{theme === "dark" ? <HiOutlineMoon /> : <HiOutlineSun />}
					</button>
				</li>
				<li className="w-full">
					<Link href="/api/auth/logout">
						<a className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-gray-500 focus:outline-none hover:bg-gray-200 dark:text-white">
							Logout <HiLogout />
						</a>
					</Link>
				</li>
			</ul>
		</Popup>
	);
};

export default ProfileDropdown;
