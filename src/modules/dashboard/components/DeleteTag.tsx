import clsx from "clsx";
import React from "react";
import { HiTrash } from "react-icons/hi";
import { Button } from "~/components/Button";
import Modal from "~/components/Modal";
import { InferQueryOutput, trpc } from "~/lib/trpc";

interface DeleteTagProps {
	/**
	 * Tag to delete
	 */
	data: NonNullable<InferQueryOutput<"tags.byId">>;

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
	// Get tag bookmarks count
	const { data: bookmarksCount } = trpc.useQuery([
		"bookmarks.count",
		{ tagName: data.name },
	]);
	const { invalidateQueries } = trpc.useContext();
	const { mutate, isLoading } = trpc.useMutation("tags.deleteById", {
		onSuccess() {
			invalidateQueries(["tags.byId"]);
			invalidateQueries(["tags.all"]);
			invalidateQueries(["bookmarks.all"]);
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
				contentProps={{
					className:
						"flex flex-col gap-8 p-8 bg-white border border-gray-300 rounded-lg dark:border-none dark:bg-gray-900",
				}}
			>
				<div className="text-center whitespace-no-wrap font-medium">
					This tag is related to {bookmarksCount} bookmarks.
					<br />
					Do you really want to delete it?
				</div>
				<div className="flex items-center justify-between w-full">
					<Button
						type="button"
						variant="ghost"
						theme="secondary"
						onClick={onClose}
					>
						Dismiss
					</Button>
					<Button
						type="button"
						theme="danger"
						isLoading={isLoading}
						onClick={() => {
							mutate(data?.id);
						}}
					>
						Delete
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default DeleteTagPopup;
