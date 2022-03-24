import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import { HiX } from "react-icons/hi";
import { Drawer } from "~/components/Drawer";
import useBreakpoints from "~/hooks/use-breakpoints";
import { useStore } from "~/store";
import CreateForm from "./CreateForm";

export default function CreateDrawer() {
	const { isLg } = useBreakpoints();
	const router = useRouter();
	const { isOpen, actions } = useStore((state) => state.createBookmark);

	return (
		<Drawer
			isOpen={isOpen}
			onClose={actions.onClose}
			position={isLg ? "right" : "bottom"}
			contentProps={{
				className: clsx([
					"p-8 bg-white dark:bg-gray-900 dark:text-white",
					"lg:h-screen lg:w-1/3 lg:rounded-l-lg w-screen h-auto rounded-t-lg",
				]),
			}}
		>
			<div className="flex items-center justify-between w-full">
				<h1 className="text-lg font-bold">Create new bookmark</h1>
				<button
					onClick={() => actions.onClose()}
					className="p-2 transition bg-gray-100 rounded-lg dark:bg-gray-600 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 dark:hover:bg-gray-500"
				>
					<HiX />
					<span className="sr-only">Close drawer</span>
				</button>
			</div>
			<div className="mt-8">
				<CreateForm onSuccess={actions.onClose} />
			</div>
		</Drawer>
	);
}
