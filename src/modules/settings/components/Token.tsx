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
					className="px-2 py-1 text-sm text-red-500 transition border border-red-500 rounded hover:bg-red-500 hover:text-white dark:border-none dark:bg-red-500 dark:text-white dark:hover:bg-red-600"
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
					className="w-4/5 lg:h-[15%] lg:w-1/5 flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 gap-4 lg:gap-8 rounded-lg"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.2 }}
				>
					<p className="mx-auto font-medium text-center lg:text-lg dark:text-white">
						Do you really want to delete this token?
					</p>
					<div className="flex items-center justify-between w-full">
						<button
							onClick={onClose}
							className="px-2 py-1 transition bg-gray-100 border border-gray-300 rounded hover:border-gray-200 dark:text-white dark:bg-gray-600 dark:border-none dark:hover:bg-gray-500"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								mutate({ id: data.id });
							}}
							className="px-2 py-1 text-red-500 transition border border-red-500 rounded hover:bg-red-500 hover:text-white dark:border-none dark:bg-red-500 dark:text-white dark:hover:bg-red-600"
						>
							Delete
						</button>
					</div>
				</ModalContent>
			</Modal>
		</>
	);
}
