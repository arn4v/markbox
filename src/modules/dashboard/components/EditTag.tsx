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
			className="top-0 ml-2 left-full"
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
			<div className="w-56 p-2 bg-white rounded-lg dark:bg-gray-900">
				<form
					className="flex flex-col w-full gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						mutate({ input: { id: data.id, name } });
					}}
				>
					<div className="text-center">Rename tag</div>
					<div className="grid grid-flow-col gap-2">
						<label htmlFor="name">Name</label>
						<input
							id="name"
							className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-current ring-offset-2  caret-black"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center justify-between w-full">
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
