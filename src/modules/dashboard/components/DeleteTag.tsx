import clsx from "clsx";
import React from "react";
import { HiTrash } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Modal, { ModalContent } from "~/components/Modal";
import Popup from "~/components/Popup";
import { genericModalMotionProps } from "~/config";
import {
	Tag,
	useDeleteTagMutation,
	useGetTagBookmarksCountQuery,
} from "~/graphql/types.generated";

interface DeleteTagProps {
	/**
	 * Tag to delete
	 */
	data: Tag;

	/**
	 * Popup open state
	 */
	isOpen: boolean;

	/**
	 * Popup open callback
	 */
	onOpen: () => void;

	/**
	 * Popup close callback
	 */
	onClose: () => void;
}

const DeleteTagPopup = ({ data, isOpen, onClose, onOpen }: DeleteTagProps) => {
	const queryClient = useQueryClient();
	// Get tag bookmarks count
	const { data: countData } = useGetTagBookmarksCountQuery({ id: data.id });
	const { mutate } = useDeleteTagMutation({
		// Invalidate queries onSuccess
		onSuccess() {
			queryClient.invalidateQueries("GetAllTags");
			queryClient.invalidateQueries("GetAllBookmarks");
			queryClient.invalidateQueries("GetTag");
		},
	});

	return (
		<>
			<button
				type="button"
				className={clsx([
					"py-2 dark:hover:bg-gray-500 flex transition gap-2 items-center justify-center focus:outline-none rounded-full h-6 w-6",
				])}
				onClick={onOpen}
			>
				<HiTrash />
			</button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				containerProps={{
					className: "flex items-center justify-center z-[60]",
				}}
				overlayProps={{ className: "bg-black/[0.75] z-[60]" }}
			>
				<ModalContent className="z-[200]" {...genericModalMotionProps}>
					<div className="flex flex-col gap-8 p-8 bg-white border border-gray-300 rounded-lg dark:border-none dark:bg-gray-900">
						<div className="text-center whitespace-no-wrap">
							This tag is related to {countData?.tagBookmarksCount} bookmarks.
							<br />
							Do you really want to delete it?
						</div>
						<div className="flex items-center justify-between w-full">
							<button
								type="button"
								className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition rounded"
								onClick={onClose}
							>
								Dismiss
							</button>
							<button
								type="button"
								className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-white transition"
								onClick={() => {
									mutate({ id: data.id });
								}}
							>
								Delete
							</button>
						</div>
					</div>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteTagPopup;
