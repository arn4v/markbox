import { useQueryClient } from "react-query";
import Modal, { ModalContent } from "~/components/Modal";
import { AccessToken, useDeleteTokenMutation } from "~/graphql/types.generated";
import useDisclosure from "~/hooks/use-disclosure";

interface Props {
	data: AccessToken;
}
export default function Token({ data }: Props) {
	const queryClient = useQueryClient();
	const { mutate } = useDeleteTokenMutation({
		onSuccess(data) {
			queryClient.invalidateQueries("GetAllTokens");
			onClose();
		},
	});
	const { isOpen, onClose, onOpen } = useDisclosure();

	return (
		<>
			<div className="flex items-center justify-between px-4 py-4">
				{data.name}
				<button
					className="px-2 py-1 text-sm text-red-500 transition border rounded dark:border-blueGray-500 hover:text-white bg-blueGray-700 hover:bg-red-500"
					onClick={onOpen}
				>
					Delete
				</button>
			</div>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				containerProps={{ className: "flex items-center justify-center" }}
				overlayProps={{ className: "bg-black/[0.75]" }}
			>
				<ModalContent
					className="w-4/5 lg:h-[15%] lg:w-1/5 flex flex-col items-center justify-center bg-blueGray-700 p-6 gap-4 lg:gap-8 rounded-lg"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.2 }}
				>
					<p className="mx-auto font-medium text-center lg:text-lg">
						Do you really want to delete this token?
					</p>
					<div className="flex items-center justify-between w-full">
						<button
							onClick={onClose}
							className="px-2 py-1 transition rounded bg-blueGray-600 hover:bg-blueGray-500"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								mutate({ id: data.id });
							}}
							className="px-2 py-1 transition bg-red-500 rounded hover:bg-red-600"
						>
							Delete
						</button>
					</div>
				</ModalContent>
			</Modal>
		</>
	);
}
