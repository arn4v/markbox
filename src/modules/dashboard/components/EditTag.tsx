import clsx from "clsx";
import React from "react";
import { HiPencil } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Popup from "~/components/Popup";
import { Tag, useRenameTagMutation } from "~/graphql/types.generated";

interface EditTagProps {
	data: Tag;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const EditTagPopup = ({ data, isOpen, onOpen, onClose }: EditTagProps) => {
	const queryClient = useQueryClient();
	const [name, setName] = React.useState<string>(data.name);
	const { mutate } = useRenameTagMutation({
		onSuccess() {
			queryClient.invalidateQueries(["GetTags"]);
		},
	});

	const internalOnClose = () => {
		setName(data.name);
		onClose();
	};

	return (
		<Popup
			isOpen={isOpen}
			onDismiss={onClose}
			className="left-full ml-2 top-0"
			placement="custom"
			showOverlay
			trigger={
				<button
					className={clsx([
						"py-2 dark:hover:bg-gray-500 flex transition gap-2 items-center justify-center focus:outline-none rounded-full h-6 w-6",
						isOpen && "z-30",
					])}
					onClick={onOpen}
				>
					<HiPencil />
				</button>
			}
		>
			<div className="p-2 w-56 bg-gray-900 rounded-lg">
				<form
					className="w-full flex flex-col gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						mutate({ input: { id: data.id, name } });
					}}
				>
					<div className="text-center">Rename tag</div>
					<div className="grid gap-2 grid-flow-col">
						<label htmlFor="name">Name</label>
						<input
							id="name"
							className="rounded-lg block mt-2 w-full focus:outline-none focus:ring ring-black caret-black text-black"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
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
							onClick={() => {}}
						>
							Rename
						</button>
					</div>
				</form>
			</div>
		</Popup>
	);
};

export default EditTagPopup;
