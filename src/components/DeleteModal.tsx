import React from "react";
import Modal, { ModalContent, ModalProps } from "./Modal";

interface Props extends Pick<ModalProps, "isOpen" | "onClose"> {
	onDelete: () => void;
	header?: string;
}

export default function DeleteModal({
	isOpen,
	onClose,
	onDelete,
	header,
}: Props) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			portalProps={{ type: "delete-modal" }}
			containerProps={{
				className: "flex items-center justify-center z-[999]",
			}}
			overlayProps={{ className: "bg-black bg-opacity-75 z-[999]" }}
		>
			<ModalContent
				className="z-[1000] flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 gap-4 lg:gap-8 rounded-lg"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.2 }}
			>
				<p className="mx-auto font-medium text-center lg:text-lg dark:text-white">
					{header ?? "Do you really want to delete this bookmark?"}
				</p>
				<div className="flex items-center justify-between w-full">
					<button
						data-test="delete-modal-cancel-button"
						onClick={onClose}
						className="px-2 py-1 transition bg-gray-100 border border-gray-300 rounded hover:border-gray-200 dark:text-white dark:bg-gray-600 dark:border-none dark:hover:bg-gray-500"
					>
						Cancel
					</button>
					<button
						data-test="delete-modal-submit-button"
						onClick={onDelete}
						className="px-2 py-1 text-red-500 transition border border-red-500 rounded hover:bg-red-500 hover:text-white dark:border-none dark:bg-red-500 dark:text-white dark:hover:bg-red-600"
					>
						Delete
					</button>
				</div>
			</ModalContent>
		</Modal>
	);
}
