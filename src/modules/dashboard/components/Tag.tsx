import { DrawingPinFilledIcon, DrawingPinIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import * as React from "react";
import { useQueryClient } from "react-query";
import { useDisclosure } from "react-sensible";
import { Tag as TagType, usePinTagMutation } from "~/graphql/types.generated";
import useDashboardStore from "../store";
import DeleteTagPopup from "./DeleteTag";
import EditTagPopup from "./EditTag";

interface TagProps {
	data: TagType;
	isActive: boolean;
	isEditModeEnabled?: boolean;
	showPin?: boolean;
}

export default function Tag({
	isEditModeEnabled = false,
	data,
	isActive,
	showPin = true,
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
	const queryClient = useQueryClient();
	const { mutate: pinTag } = usePinTagMutation({
		onSuccess() {
			queryClient.invalidateQueries("GetAllTags");
		},
	});
	const setTag = useDashboardStore((state) => state.setTag);

	return (
		<li
			data-test="dashboard-tag"
			className={clsx(["flex w-full gap-4 items-center"])}
		>
			<button
				onClick={() => {
					setTag(data.name);
				}}
				className={clsx([
					"px-4 py-2 flex-grow transition rounded-md dark:text-white border flex items-center justify-between",
					isDeleteOpen && "z-30",
					isActive
						? "dark:bg-gray-500 lg:dark:bg-gray-800 lg:dark:border-gray-700 bg-gray-200 border-gray-300 dark:border-gray-400 font-medium"
						: "lg:dark:bg-gray-900 lg:dark:hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 bg-gray-100 hover:bg-gray-200 border-transparent",
				])}
			>
				<span>{data.name}</span>
				<button
					hidden={!showPin}
					onClick={(e) => {
						e.stopPropagation();
						pinTag({ id: data?.id, isPinned: !data.isPinned });
					}}
				>
					{data?.isPinned ? (
						<DrawingPinFilledIcon className="h-5 w-5" />
					) : (
						<DrawingPinIcon className="h-5 w-5" />
					)}
				</button>
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
