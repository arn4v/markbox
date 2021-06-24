import * as React from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import Popup from "~/components/Popup";
import useDisclosure from "~/hooks/use-disclosure";
import useOnClickOutside from "~/hooks/use-onclickoutside";
import { useAuth } from "~/providers/AuthProvider";

const ProfileDropdown = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user } = useAuth();

	return (
		<Popup
			isOpen={isOpen}
			onDismiss={onClose}
			className="bottom-0 flex flex-col gap-2"
			button={
				<button
					onClick={isOpen ? onClose : onOpen}
					className="w-full text-white font-medium items-center justify-center hover:bg-blueGray-600 flex px-2 py-2 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg gap-2 focus:outline-none">
					Account
					<HiOutlineChevronDown />
				</button>
			}>
			<span className="whitespace-nowrap">Signed in as {user?.email}</span>
			<span className="whitespace-nowrap">Signed in as {user?.email}</span>
			<span className="whitespace-nowrap">Signed in as {user?.email}</span>
			<span className="whitespace-nowrap">Signed in as {user?.email}</span>
		</Popup>
	);
};

export default ProfileDropdown;
