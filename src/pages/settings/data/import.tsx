import clsx from "clsx";
import { NextSeo } from "next-seo";
import React from "react";
import axios from "redaxios";
import { HiUpload, HiX } from "react-icons/hi";
import { useMutation } from "react-query";
import Modal, { ModalContent } from "~/components/Modal";
import Spinner from "~/components/Spinner";
import useDisclosure from "~/hooks/use-disclosure";
import SettingsPageWrapper from "~/modules/settings/components/SettingsPageWrapper";

const ImportPage = () => {
	const { isOpen, onClose, onOpen } = useDisclosure();

	return (
		<>
			<SettingsPageWrapper>
				<NextSeo title="Import bookmarks" noindex />
				<div className="flex flex-col flex-grow w-full gap-8 pl-0 mt-4 lg:mt-0 lg:pl-12">
					<div className="flex items-center justify-between w-full pb-4 border-b border-blueGray-500">
						<span className="text-xl font-bold">Import bookmarks</span>
					</div>
					<div className="flex flex-col">
						<button
							className="p-8 w-full flex items-center justify-center gap-6 font-bold text-xl bg-gray-100 rounded-lg dark:bg-gray-900 hover:bg-gray-200 transition dark:hover:bg-gray-800"
							onClick={onOpen}
						>
							<HiUpload />
							Import from browser HTML exports
						</button>
					</div>
				</div>
			</SettingsPageWrapper>
			<UploadFileModal isOpen={isOpen} onClose={onClose} />
		</>
	);
};

const UploadFileModal = ({ isOpen, onClose }) => {
	const [file, setFile] = React.useState<File>(null);
	const { mutate, isLoading } = useMutation((file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		return axios.post("/api/import/netscape", formData);
	});
	const inputRef = React.useRef<HTMLInputElement>(null);

	const _onClose = React.useCallback(() => {
		setFile(null);
		onClose();
	}, [onClose]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={_onClose}
			containerProps={{
				className: "flex items-center justify-center z-[60]",
			}}
			overlayProps={{ className: "bg-black/[0.75] z-[60]" }}
		>
			<ModalContent
				className="lg:h-[20%] z-[200] lg:w-[22%] flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 gap-4 lg:gap-8 rounded-lg"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.2 }}
			>
				<div className="w-full flex items-center justify-between">
					<span className="text-lg font-bold">Upload file</span>
					<button onClick={_onClose}>
						<HiX />
					</button>
				</div>
				<input
					ref={inputRef}
					type="file"
					onChange={(e) => {
						setFile(e.target.files.item(0));
					}}
					accept=".html"
					hidden
				/>
				<div
					className={clsx(
						"flex items-center gap-8 w-full",
						!file ? "justify-center" : "justify-between",
					)}
				>
					{file ? <>File selected: {file?.name}</> : null}
					<button
						className="flex items-center justify-center bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition border border-gray-200 shadow px-2 py-1.5 rounded-md"
						onClick={() => {
							inputRef.current.click();
						}}
					>
						{file ? "Change file" : "Click here to select file"}
					</button>
				</div>
				<div className="w-full flex items-center justify-between">
					<button
						onClick={_onClose}
						className={clsx(
							"px-2 py-1.5 border border-gray-200 text-red-500 dark:text-red-400 dark:hover:text-white rounded-md shadow hover:bg-red-400 dark:hover:bg-red-500 bg-white font-medium dark:bg-gray-800 hover:text-white fonrt-medium transition",
						)}
					>
						Cancel
					</button>
					<button
						className={clsx(
							"px-2 py-1.5 border border-gray-200 rounded-md shadow font-medium transition dark:bg-gray-600",
							file === null
								? "bg-gray-100 cursor-not-allowed text-gray-400"
								: "bg-white dark:bg-gray-800 dark:hover:bg-gray-700",
						)}
						onClick={() => {
							mutate(file);
						}}
						disabled={!file}
					>
						{isLoading ? <Spinner /> : "Upload"}
					</button>
				</div>
			</ModalContent>
		</Modal>
	);
};
export default ImportPage;
