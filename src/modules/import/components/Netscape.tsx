import React from "react";
import { HiUpload } from "react-icons/hi";
import useDisclosure from "~/hooks/use-disclosure";
import UploadNetscapeModal from "./UploadNetscapeModal";

const Netscape = () => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	return (
		<>
			<button
				className="p-8 w-full flex items-center justify-center gap-6 font-bold text-xl bg-gray-100 rounded-lg dark:bg-gray-900 hover:bg-gray-200 transition dark:hover:bg-gray-800"
				onClick={onOpen}
			>
				Import from browser HTML exports
			</button>
			<UploadNetscapeModal isOpen={isOpen} onClose={onClose} />
		</>
	);
};

export default Netscape;
