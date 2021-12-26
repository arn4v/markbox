import clsx from "clsx";
import { format } from "date-fns";
import React from "react";
import { HiX } from "react-icons/hi";
import { useMutation } from "react-query";
import axios from "redaxios";
import Modal, { ModalContent } from "~/components/Modal";
import Spinner from "~/components/Spinner";

const ExportJsonModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose(): void;
}) => {
	const [blob, setBlob] = React.useState<Blob | null>(null);
	const [download, setDownload] = React.useState<string>("");
	const downloadElRef = React.useRef<HTMLAnchorElement>(null);
	const downloadHref = React.useMemo(() => {
		return blob ? URL.createObjectURL(blob) : "#";
	}, [blob]);
	const { mutate, isLoading } = useMutation(
		() => {
			return axios.get("/api/export/json", {
				withCredentials: true,
			});
		},
		{
			onSuccess(res) {
				const results = res.data.results;
				const date = new Date(results.exported_at);
				const fileName = `bookmarky-export-${format(date, "yyyyMMdd")}.json`;
				setBlob(
					new Blob([JSON.stringify(results, null, 4)], {
						type: "application/json",
					}),
				);
				setDownload(fileName);
				if (downloadElRef.current) downloadElRef.current.click();
				setBlob(null);
				setDownload("");
				onClose();
			},
		},
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
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
					<span className="text-lg font-bold">Export to JSON</span>
					<button onClick={onClose}>
						<HiX />
					</button>
				</div>
				<a download={download} href={downloadHref} ref={downloadElRef} hidden />
				<div className="w-full flex items-center justify-between">
					<button
						onClick={onClose}
						className={clsx(
							"px-2 py-1.5 border border-gray-200 text-red-500 dark:text-red-400 dark:hover:text-white rounded-md shadow hover:bg-red-400 dark:hover:bg-red-500 bg-white font-medium dark:bg-gray-800 hover:text-white fonrt-medium transition",
						)}
					>
						Cancel
					</button>
					<button
						className={clsx(
							"w-44 whitespace-nowrap py-1.5 border border-gray-200 rounded-md shadow font-medium transition dark:bg-gray-600 flex items-center justify-center",
							!!blob
								? "bg-gray-100 cursor-not-allowed text-gray-400"
								: "bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700",
						)}
						onClick={() => {
							mutate();
						}}
						disabled={!!blob}
					>
						{isLoading ? (
							<Spinner className="h-5 w-5 mr-0" />
						) : (
							"Download export.json"
						)}
					</button>
				</div>
			</ModalContent>
		</Modal>
	);
};

export default ExportJsonModal;
