import { format } from "date-fns";
import React from "react";
import { HiX } from "react-icons/hi";
import { Button } from "~/components/Button";
import Modal from "~/components/Modal";
import { trpc } from "~/lib/trpc";

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
	const { mutate, isLoading } = trpc.useMutation("userdata.export-json", {
		onSuccess(res) {
			const date = new Date(res.results.exported_at);
			const fileName = `bookmarky-export-${format(date, "yyyyMMdd")}.json`;
			setBlob(
				new Blob([JSON.stringify(res.results, null, 4)], {
					type: "application/json",
				}),
			);
			setDownload(fileName);
			if (downloadElRef.current) downloadElRef.current.click();
			setBlob(null);
			setDownload("");
			onClose();
		},
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			overlayProps={{ className: "bg-black/[0.75] z-[60]" }}
			contentProps={{
				className:
					"z-[200] lg:min-w-[22%] flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 gap-4 lg:gap-8 rounded-lg w-[350px]",
			}}
		>
			<button onClick={onClose} className="absolute right-4 top-4 rounded-full hover:bg-slate-200 p-1 transition">
				<HiX />
			</button>
			<div className="w-full flex items-center justify-between">
				<span className="text-lg font-bold">Export to JSON</span>
			</div>
			<a download={download} href={downloadHref} ref={downloadElRef} hidden />
			<div className="w-full flex items-center justify-between">
				<Button
					onClick={() => {
						mutate();
					}}
					className="w-full"
					isLoading={isLoading}
					disabled={!!blob}
				>
					Download JSON file
				</Button>
			</div>
		</Modal>
	);
};

export default ExportJsonModal;
