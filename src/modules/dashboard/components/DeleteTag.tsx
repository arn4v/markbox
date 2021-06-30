import clsx from "clsx";
import React from "react";
import { HiTrash } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Popup from "~/components/Popup";
import {
	Tag,
	useDeleteTagMutation,
	useGetTagBookmarksCountQuery,
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
			className="left-full ml-2 top-0"
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
						"py-2 dark:hover:bg-blueGray-500 flex transition gap-2 items-center justify-center focus:outline-none rounded-full h-6 w-6",
					])}
					onClick={onOpen}
				>
					<HiTrash />
				</button>
			}
		>
			<div className="p-2 flex flex-col gap-4 w-56 bg-blueGray-700 rounded-lg">
				<div className="text-center">
					This tag is related to {countData?.tagBookmarksCount} bookmarks. Do
					you really want to delete it?
				</div>
				<div className="w-full items-center flex justify-between">
					<button
						type="button"
						className="px-1 py-0.5 text-sm bg-red-500 hover:bg-red-600 rounded"
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
