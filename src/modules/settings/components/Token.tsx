import type { AccessToken } from "@prisma/client";
import { useDisclosure } from "react-sensible";
import DeleteModal from "~/components/DeleteModal";
import { trpc } from "~/lib/trpc";

interface Props {
	data: Pick<AccessToken, "id" | "name">;
}

export default function Token({ data }: Props) {
	const { invalidateQueries } = trpc.useContext();
	const { mutate } = trpc.useMutation("tokens.delete", {
		onSuccess() {
			invalidateQueries(["tokens.all"]);
			onClose();
		},
	});
	const { isOpen, onClose, onOpen } = useDisclosure();

	return (
		<>
			<div className="flex items-center justify-between px-4 py-4">
				{data.name}
				<button
					className="px-2 py-1 text-sm text-red-500 transition border border-red-500 rounded hover:bg-red-500 hover:text-white dark:border-none dark:bg-red-500 dark:text-white dark:hover:bg-red-600"
					onClick={onOpen}
				>
					Delete
				</button>
			</div>
			<DeleteModal
				header="Do you really want to delete this token?"
				isOpen={isOpen}
				onClose={onClose}
				onDelete={() => {
					mutate(data.id);
				}}
			/>
		</>
	);
}
