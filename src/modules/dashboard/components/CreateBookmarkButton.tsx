import * as React from "react";
import { HiPlus } from "react-icons/hi";
import useDisclosure from "~/hooks/use-disclosure";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import Modal from "~/components/Modal";
import { motion } from "framer-motion";
import Drawer from "~/components/Drawer";
import VanillaDrawer from "~/components/VanillaDrawer";

const MotionDialog = motion(Dialog);

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
			<VanillaDrawer isOpen={isOpen} onClose={onClose} placement="right">
				hey
			</VanillaDrawer>
			{/* <Modal isOpen={isOpen} onClose={onClose}>
				<Modal.Content
					className="dark:bg-blueGray-700 rounded-lg h-auto w-3/5"
					variants={{
						initial: {
							y: -20,
						},
						animate: {
							y: 0,
						},
					}}
					initial="initial"
					animate="animate"
					exit="initial"
					transition={{
						duration: 0.2,
						ease: "easeInOut",
					}}></Modal.Content>
			</Modal> */}
		</>
	);
}
