import { CardStackIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import React from "react";
import { useDisclosure } from "react-sensible";
import { Drawer } from "~/components/Drawer";
import TagsList from "./TagsList";

export default function TagsDrawer(): JSX.Element {
	const { isOpen, onClose, onOpen } = useDisclosure();

	return (
		<>
			<button onClick={onOpen} className="focus:outline-none dark:text-white">
				<CardStackIcon className="w-5 h-5" />
			</button>
			<Drawer
				isOpen={isOpen}
				onClose={onClose}
				position="bottom"
				contentProps={{
					className:
						"w-full h-auto py-8 bg-white rounded-t-lg dark:bg-gray-900 overflow-y-scroll scrollbar scrollbar-thin dark:scrollbar-thumb-gray-500 scrollbar-track-gray-500 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 max-h-[75%]",
				}}
			>
				<div className={clsx(["flex flex-col w-full gap-4 px-6 text-base"])}>
					<h1 className="text-lg font-bold dark:text-white">Tags</h1>
					<TagsList />
				</div>
			</Drawer>
		</>
	);
}
