import useDisclosure from "~/hooks/use-disclosure";
import ExportJsonModal from "./ExportJsonModal";

const ExportJson = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<button
				className="p-8 w-full flex items-center justify-center gap-6 font-bold text-xl bg-gray-100 rounded-lg dark:bg-gray-900 hover:bg-gray-200 transition dark:hover:bg-gray-800"
				onClick={onOpen}
			>
				Export to Json
			</button>
			<ExportJsonModal isOpen={isOpen} onClose={onClose} />
		</>
	);
};

export default ExportJson;
