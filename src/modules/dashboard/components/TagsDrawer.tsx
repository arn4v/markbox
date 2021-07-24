import { CardStackIcon } from "@radix-ui/react-icons";
import React from "react";
import { useDisclosure } from "react-sensible";
import Drawer, { DrawerContent } from "~/components/Drawer";
import useStore from "../../common/components/Create";
import TagsList from "./TagsList";

export default function TagsDrawer(): JSX.Element {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { isOpen: isCreateOpen, onClose: onCreateClose } = useStore();

	return (
		<>
			<button
				onClick={() => {
					if (isCreateOpen) onCreateClose();
					onOpen();
				}}
				className="focus:outline-none dark:text-white"
			>
				<CardStackIcon className="w-5 h-5" />
			</button>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent
					placement="bottom"
					className="w-full h-auto py-8 bg-white rounded-t-lg dark:bg-gray-900 overflow-y-scroll scrollbar scrollbar-thin dark:scrollbar-thumb-gray-500 scrollbar-track-gray-500 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 max-h-[75%]"
				>
					<TagsList />
				</DrawerContent>
			</Drawer>
		</>
	);
}
