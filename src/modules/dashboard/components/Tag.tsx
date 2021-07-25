import clsx from "clsx";
import * as React from "react";
import { useDisclosure } from "react-sensible";
import { Tag as TagType } from "~/graphql/types.generated";
import useDashboardStore from "../store";
import DeleteTagPopup from "./DeleteTag";
import EditTagPopup from "./EditTag";

interface TagProps {
	data: TagType;
	isActive: boolean;
	isEditModeEnabled?: boolean;
}

export default function Tag({
	isEditModeEnabled = false,
	data,
	isActive,
}: TagProps) {
	const {
		isOpen: isDeleteOpen,
		onClose: onDeleteClose,
		onOpen: onDeleteOpen,
	} = useDisclosure();
	const {
		isOpen: isEditOpen,
		onClose: onEditClose,
		onOpen: onEditOpen,
	} = useDisclosure();
	const { tag, setTag } = useDashboardStore();

	return (
		<li className={clsx(["flex w-full gap-4 items-center"])}>
			<button
				onClick={() => {
					setTag(data.name);
				}}
				className={clsx([
					"px-4 py-2 flex-grow transition rounded-md dark:text-white border",
					isDeleteOpen && "z-30",
					isActive
						? "dark:bg-gray-500 lg:dark:bg-gray-600 bg-gray-200 border-gray-300 font-medium"
						: "lg:dark:bg-gray-900 lg:dark:hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 bg-gray-100 hover:bg-gray-200 border-transparent",
				])}
			>
				{data.name}
			</button>
			{isEditModeEnabled && (
				<div className="flex items-center gap-4">
					<EditTagPopup
						data={data}
						isOpen={isEditOpen}
						onClose={onEditClose}
						onOpen={onEditOpen}
					/>
					<DeleteTagPopup
						data={data}
						isOpen={isDeleteOpen}
						onClose={onDeleteClose}
						onOpen={onDeleteOpen}
					/>
				</div>
			)}
		</li>
	);
}
