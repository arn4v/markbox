import React from "react";
import { useDisclosure } from "react-sensible";
import UploadJsonModal from "./JsonModal";

const JsonImport = () => {
	const { isOpen, onClose, onOpen } = useDisclosure();

	return (
		<>
			<button
				className="p-8 w-full flex items-center justify-center gap-6 font-bold text-xl bg-gray-100 rounded-lg dark:bg-gray-900 hover:bg-gray-200 transition dark:hover:bg-gray-800"
				onClick={onOpen}
			>
				Import Markbox JSON export
			</button>
			<UploadJsonModal isOpen={isOpen} onClose={onClose} />
		</>
	);
};

export default JsonImport;
