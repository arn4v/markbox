import * as React from "react";
import { HiClipboardCheck, HiClipboardCopy } from "react-icons/hi";

//
export function CopyCode({ value }: { value: string }) {
	const [isCopied, setCopied] = React.useState(false);

	return (
		<div className="flex items-start space-x-4">
			<input
				value={value}
				// disabled={true}
				className="text-black dark:text-white rounded outline-none border border-gray-200 focus:border-gray-400 caret-black dark:bg-gray-900 dark:focus:border-gray-700 dark:border-gray-600 dark:focus:bg-gray-800 dark:caret-white dark:placeholder-gray-400 resize-none px-4 py-2"
			/>
			<button
				className="p-2 focus:outline-none bg-white hover:bg-stone-50 transition rounded-md border border-gray-200 h-full"
				onClick={() => {
					navigator.clipboard.writeText(value);
					setCopied(true);
					setTimeout(() => setCopied(false), 1000);
				}}
			>
				{!isCopied ? (
					<HiClipboardCopy className="h-5 w-5" />
				) : (
					<HiClipboardCheck className="h-5 w-5" />
				)}
			</button>
		</div>
	);
}
