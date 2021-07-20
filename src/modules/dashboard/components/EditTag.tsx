import clsx from "clsx";
import React from "react";
import { HiPencil } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Modal, { ModalContent } from "~/components/Modal";
import Popup from "~/components/Popup";
import { genericModalMotionProps } from "~/config";
import { Tag, useRenameTagMutation } from "~/graphql/types.generated";

interface EditTagProps {
	data: Tag;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const EditTagPopup = ({ data, isOpen, onOpen, onClose }: EditTagProps) => {
	const queryClient = useQueryClient();
	const [name, setName] = React.useState<string>(undefined);
	const { mutate } = useRenameTagMutation({
		// Invalidate GetTags query on successful rename
		onSuccess(data) {
			queryClient.invalidateQueries("GetAllTags");
			onClose();
		},
	});

	React.useEffect(() => {
		if (!name) setName(data.name);
	}, [data, name]);

	return (
		<>
			<button
				className={clsx([
					"py-2 dark:hover:bg-gray-500 flex transition gap-2 items-center justify-center focus:outline-none rounded-full h-6 w-6",
					isOpen && "z-30",
				])}
				onClick={onOpen}
			>
				<HiPencil />
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
					<div className="p-8 bg-white border border-gray-300 rounded-lg dark:border-none dark:bg-gray-900">
						<form
							className="flex flex-col w-full gap-8"
							onSubmit={(e) => {
								e.preventDefault();
								mutate({ input: { id: data.id, name } });
							}}
						>
							<div className="text-center font-bold text-lg">Rename tag</div>
							<div className="flex gap-6 items-center">
								<label htmlFor="name">Name</label>
								<input
									id="name"
									className="block w-full text-black dark:text-white rounded outline-none border border-gray-300 focus:border-gray-400 px-2 py-2 caret-black dark:bg-gray-900 dark:focus:border-gray-700 dark:border-gray-600 dark:focus:bg-gray-800 dark:caret-white"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
							<div className="flex items-center justify-between w-full">
								<button
									type="button"
									className="px-2 py-0.5 bg-red-500 hover:bg-red-600 rounded text-white transition"
									onClick={onClose}
								>
									Dismiss
								</button>
								<button
									type="submit"
									className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition rounded dark:text-white"
								>
									Rename
								</button>
							</div>
						</form>
					</div>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditTagPopup;
