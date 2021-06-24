import * as React from "react";
import { HiPlus } from "react-icons/hi";
import useDisclosure from "~/hooks/use-disclosure";
import { motion } from "framer-motion";
import Drawer, { DrawerContent } from "~/components/Drawer";

export default function CreateBookmarkButton() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<button
				className="w-full text-white font-medium items-center justify-center hover:bg-blueGray-600 flex px-2 py-2 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg gap-2"
				onClick={onOpen}>
				Create bookmark
				<HiPlus className="h-5 w-5" />
			</button>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent placement="right" className="h-screen w-1/5">
					Hey
				</DrawerContent>
			</Drawer>
		</>
	);
}
