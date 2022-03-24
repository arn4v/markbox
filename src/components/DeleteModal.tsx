import React from "react";
import { genericModalProps } from "~/config";
import { Button } from "./Button";
import Modal, { ModalProps } from "./Modal";

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
			contentProps={{
				className:
					"z-[1000] flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 gap-4 lg:gap-8 rounded-lg",
			}}
			{...genericModalProps}
		>
			<p className="mx-auto font-medium text-center lg:text-lg dark:text-white">
				{header ?? "Do you really want to delete this bookmark?"}
			</p>
			<div className="flex items-center justify-between w-full">
				<Button
					variant="ghost"
					theme="secondary"
					data-test="delete-modal-cancel-button"
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					data-test="delete-modal-submit-button"
					variant="solid"
					theme="danger"
					onClick={onDelete}
				>
					Delete
				</Button>
			</div>
		</Modal>
	);
}
