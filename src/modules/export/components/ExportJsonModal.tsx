import { format } from "date-fns";
import React from "react";
import { HiX } from "react-icons/hi";
import Button from "~/components/Button";
import Modal, { ModalContent } from "~/components/Modal";
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
					<Button onClick={onClose} theme="danger" variant="outline">
						Cancel
					</Button>
					<Button
						onClick={() => {
							mutate();
						}}
						isLoading={isLoading}
						disabled={!!blob}
					>
						Download JSON file
					</Button>
				</div>
			</ModalContent>
		</Modal>
	);
};

export default ExportJsonModal;
