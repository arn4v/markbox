import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import { HiX } from "react-icons/hi";
import Drawer, { DrawerContent } from "~/components/Drawer";
import useBreakpoints from "~/hooks/use-breakpoints";
import CreateForm from "./CreateForm";
import useStore from "./store";

export default function CreateDrawer() {
	const { isLg } = useBreakpoints();
	const drawerPlacement = React.useMemo(() => {
		return isLg ? "right" : "bottom";
	}, [isLg]);
	const router = useRouter();
	const { isOpen, onClose, onOpen } = useStore();

	return (
		<Drawer isOpen={isOpen} onClose={onClose}>
			<DrawerContent
				placement={drawerPlacement}
				className={clsx([
					"p-8 bg-white dark:bg-gray-900 dark:text-white",
					"lg:h-screen lg:w-1/3 lg:rounded-l-lg w-screen h-auto rounded-t-lg",
				])}
			>
				<div className="flex items-center justify-between w-full">
					<h1 className="text-lg font-bold">Create new bookmark</h1>
					<button
						onClick={() => onClose()}
						className="p-2 transition bg-gray-100 rounded-lg dark:bg-gray-600 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 dark:hover:bg-gray-500"
					>
						<HiX />
						<span className="sr-only">Close drawer</span>
					</button>
				</div>
				<div className="mt-8">
					<CreateForm onSuccess={onClose} />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
