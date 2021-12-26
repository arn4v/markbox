import clsx from "clsx";
import React from "react";
import toast from "react-hot-toast";
import { HiX } from "react-icons/hi";
import { useMutation } from "react-query";
import axios from "redaxios";
import Modal, { ModalContent } from "~/components/Modal";
import Spinner from "~/components/Spinner";

const UploadNetscapeModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose(): void;
}) => {
	const [file, setFile] = React.useState<File | null>(null);
	const { mutate, isLoading } = useMutation(
		(file: File) => {
			const formData = new FormData();
			formData.append("file", file);
			return axios.post("/api/import/netscape", formData);
		},
		{
			onSuccess(res) {
				if (res.status === 204) {
					toast.success(
						`Queued for import, try again if bookmarks don't show up in 2-3 minutes.`,
					);
				}
				_onClose();
			},
			onError() {
				toast.error("Unable to import file, try again in a few minutes.");
				setFile(null);
				onClose();
			},
		},
	);
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
				className="z-[200] lg:min-w-[22%] flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 gap-4 lg:gap-8 rounded-lg"
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
						if (e.target.files instanceof FileList)
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
					{file ? (
						<>
							<span className="font-medium">File selected:</span> {file?.name}
						</>
					) : null}
					<button
						className="flex items-center justify-center bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition border border-gray-200 shadow px-2 py-1.5 rounded-md"
						onClick={() => {
							if (inputRef.current instanceof HTMLInputElement)
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
							"w-20 py-1.5 border border-gray-200 rounded-md shadow font-medium transition dark:bg-gray-600 flex items-center justify-center",
							file === null
								? "bg-gray-100 cursor-not-allowed text-gray-400"
								: "bg-white dark:bg-gray-800 dark:hover:bg-gray-700",
						)}
						onClick={() => {
							if (file instanceof File) mutate(file);
						}}
						disabled={!file}
					>
						{isLoading ? <Spinner className="h-5 w-5 mr-0" /> : "Upload"}
					</button>
				</div>
			</ModalContent>
		</Modal>
	);
};

export default UploadNetscapeModal;
