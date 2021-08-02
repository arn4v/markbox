import { HiX } from "react-icons/hi";
import Modal, { ModalContent } from "~/components/Modal";
import { genericModalMotionProps, genericModalProps } from "~/config";

type Props = {
	isOpen: boolean;
	onClose(): void;
	data: string;
};

export default function BookmarkModal({ isOpen, onClose, data }: Props) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} {...genericModalProps}>
			<ModalContent
				{...genericModalMotionProps}
				className="flex flex-col space-y-8 p-6 w-2/5 mx-auto dark:bg-gray-900 bg-white rounded-lg"
			>
				<div className="w-full flex items-center justify-between">
					<span className="font-bold text-lg">Bookmark description</span>
					<button onClick={onClose}>
						<HiX />
					</button>
				</div>
				<div className="break-all">{data}</div>
			</ModalContent>
		</Modal>
	);
}
