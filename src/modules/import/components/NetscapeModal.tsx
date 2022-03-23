import clsx from "clsx";
import React from "react";
import { HiX } from "react-icons/hi";
import Modal from "~/components/Modal";
import Spinner from "~/components/Spinner";
import { trpc } from "~/lib/trpc";

const UploadNetscapeModal = ({
	isOpen,
	onClose: outerOnClose,
}: {
	isOpen: boolean;
	onClose(): void;
}) => {
	const [file, setFile] = React.useState<File | null>(null);
	const { mutate, isLoading } = trpc.useMutation("userdata.import-netscape");
	const inputRef = React.useRef<HTMLInputElement>(null);

	const innerOnClose = () => {
		setFile(null);
		outerOnClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={innerOnClose}
			overlayProps={{ className: "bg-black/[0.75] z-[60]" }}
			contentProps={{
				className:
					"z-[200] lg:min-w-[22%] flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 gap-4 lg:gap-8 rounded-lg w-[350px]",
			}}
		>
			<div className="w-full flex items-center justify-between">
				<span className="text-lg font-bold">Upload file</span>
				<button onClick={innerOnClose}>
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
					onClick={innerOnClose}
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
						if (file instanceof File) {
							file.text().then((html) => mutate(html));
						}
					}}
					disabled={!file}
				>
					{isLoading ? <Spinner className="h-5 w-5 mr-0" /> : "Upload"}
				</button>
			</div>
		</Modal>
	);
};

export default UploadNetscapeModal;
