import clsx from "clsx";
import React from "react";
import { HiPencil } from "react-icons/hi";
import Input from "~/components/Input";
import Modal, { ModalContent } from "~/components/Modal";
import { genericModalMotionProps } from "~/config";
import { InferQueryOutput, trpc } from "~/lib/trpc";

interface EditTagProps {
	data: NonNullable<InferQueryOutput<"tags.byId">>;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const EditTagPopup = ({ data, isOpen, onOpen, onClose }: EditTagProps) => {
	const [name, setName] = React.useState<string>(data?.name);
	const { invalidateQueries } = trpc.useContext();
	const { mutate } = trpc.useMutation("tags.rename", {
		// Invalidate GetTags query on successful rename
		onSuccess() {
			invalidateQueries(["tags.all"]);
			invalidateQueries(["bookmarks.all"]);
			onClose();
		},
	});

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
				overlayProps={{ className: "bg-black bg-opacity-75 z-[60]" }}
			>
				<ModalContent className="z-[200]" {...genericModalMotionProps}>
					<div className="p-6 bg-white border border-gray-300 rounded-lg dark:border-none dark:bg-gray-900">
						<form
							className="flex flex-col w-full gap-8"
							onSubmit={(e) => {
								e.preventDefault();
								mutate({ id: data.id, name });
							}}
						>
							<div className="text-center font-bold text-lg">Rename tag</div>
							<div className="flex gap-6 items-center">
								<label htmlFor="name">Name</label>
								<Input
									className="block w-full px-2 py-2"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Name"
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
