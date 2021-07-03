import clsx from "clsx";
import React from "react";
import { HiTrash } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Popup from "~/components/Popup";
import {
	Tag,
	useDeleteTagMutation,
	useGetTagBookmarksCountQuery
} from "~/graphql/types.generated";

interface DeleteTagProps {
	data: Tag;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const DeleteTagPopup = ({ data, isOpen, onClose, onOpen }: DeleteTagProps) => {
	const queryClient = useQueryClient();
	const { data: countData } = useGetTagBookmarksCountQuery({ id: data.id });
	const { mutate } = useDeleteTagMutation({
		onSuccess() {
			queryClient.invalidateQueries("GetAllTags");
			queryClient.invalidateQueries("GetAllBookmarks");
			queryClient.invalidateQueries("GetTag");
		},
	});

	return (
		<Popup
			isOpen={isOpen}
			onDismiss={onClose}
			className="top-0 ml-2 left-full"
			placement="custom"
			showOverlay
			trigger={
				<button
					type="button"
					style={
						isOpen
							? {
									zIndex: 30,
							  }
							: {}
					}
					className={clsx([
						"py-2 dark:hover:bg-gray-500 flex transition gap-2 items-center justify-center focus:outline-none rounded-full h-6 w-6",
					])}
					onClick={onOpen}
				>
					<HiTrash />
				</button>
			}
		>
			<div className="flex flex-col gap-4 p-6 bg-white border border-gray-300 rounded-lg w-72 dark:border-none dark:bg-gray-900">
				<div className="text-center whitespace-no-wrap">
					This tag is related to {countData?.tagBookmarksCount} bookmarks.
					<br />
					Do you really want to delete it?
				</div>
				<div className="flex items-center justify-between w-full">
					<button
						type="button"
						className="px-1 py-0.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition rounded"
						onClick={onClose}
					>
						Dismiss
					</button>
					<button
						type="button"
						className="px-1 py-0.5 text-sm bg-red-500 hover:bg-red-600 rounded"
						onClick={() => {
							mutate({ id: data.id });
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</Popup>
	);
};

export default DeleteTagPopup;
