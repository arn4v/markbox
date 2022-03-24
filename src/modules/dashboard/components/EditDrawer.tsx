import clsx from "clsx";
import React from "react";
import { HiX } from "react-icons/hi";
import { Drawer } from "~/components/Drawer";
import useBreakpoints from "~/hooks/use-breakpoints";
import { trpc } from "~/lib/trpc";
import EditForm from "~/modules/dashboard/components/EditForm";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	id: string;
}

const EditDrawer = ({ isOpen, onClose, id }: Props) => {
	const { isLg } = useBreakpoints();
	const { invalidateQueries } = trpc.useContext();
	const onSuccess = () => {
		invalidateQueries(["bookmarks.all"]);
		invalidateQueries(["bookmarks.byId", id]);
		invalidateQueries(["tags.all"]);
		onClose();
	};

	return (
		<Drawer
			isOpen={isOpen}
			onClose={onClose}
			position={isLg ? "right" : "bottom"}
			contentProps={{
				className: clsx([
					"p-8 bg-white dark:bg-gray-900 dark:text-white",
					isLg ? "h-screen w-1/3 rounded-l-lg" : "w-screen h-auto rounded-t-lg",
				]),
			}}
		>
			<div className="flex flex-col w-full gap-6">
				<div className="flex items-center justify-between w-full">
					<h1 className="text-lg font-bold">Edit bookmark</h1>
					<button
						onClick={onClose}
						className="p-2 transition bg-gray-100 rounded-lg dark:bg-gray-600 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 dark:hover:bg-gray-500"
					>
						<HiX />
						<span className="sr-only">Close drawer</span>
					</button>
				</div>
				<div className="lg:mt-8">
					<EditForm id={id} onSuccess={onSuccess} />
				</div>
			</div>
		</Drawer>
	);
};

export default EditDrawer;
