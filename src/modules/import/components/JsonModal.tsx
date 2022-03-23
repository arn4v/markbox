import clsx from "clsx";
import * as React from "react";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import Modal from "~/components/Modal";
import { trpc } from "~/lib/trpc";

const UploadJsonModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose(): void;
}) => {
	const [file, setFile] = React.useState<File | null>(null);
	const { mutate, isLoading } = trpc.useMutation("userdata.import-json", {
		onSuccess() {
			toast.success(
				`Queued for import, try again if bookmarks don't show up in 2-3 minutes.`,
			);
		},
		onError() {
			toast.error("Unable to import file, try again in a few minutes.");
		},
		onSettled() {
			setFile(null);
			onClose();
		},
	});
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			contentProps={{
				className:
					"z-[200] lg:min-w-[22%] flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 gap-4 lg:gap-8 rounded-lg w-[350px]",
			}}
			overlayProps={{ className: "bg-black/[0.75] z-[60]" }}
		>
			<div className="w-full flex items-center justify-between">
				<span className="text-lg font-bold">Upload file</span>
			</div>
			<input
				ref={inputRef}
				type="file"
				onChange={(e) => {
					if (e.target.files instanceof FileList) setFile(e.target.files[0]);
				}}
				accept=".json"
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
						if (inputRef.current instanceof HTMLInputElement)
							inputRef?.current.click();
					}}
				>
					{file ? "Change file" : "Click here to select file"}
				</button>
			</div>
			<div className="w-full flex items-center justify-between">
				<Button variant="outline" theme="danger" onClick={onClose}>
					Cancel
				</Button>
				<Button
					onClick={() => {
						if (file instanceof File) {
							file
								.text()
								.then((value) => JSON.parse(value))
								.then((json) => mutate(json));
						}
					}}
					isLoading={isLoading}
					disabled={!file || isLoading}
				>
					Upload
				</Button>
			</div>
		</Modal>
	);
};

export default UploadJsonModal;
