import clsx from "clsx";
import * as React from "react";
import { HiX } from "react-icons/hi";
import { InferQueryOutput } from "~/lib/trpc";
import Badge from "./Badge";

export function TagInput({
	data,
	tags,
	setTags,
}: {
	data: InferQueryOutput<"tags.all">;
	tags: string[];
	setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
	const [newTag, setNewTag] = React.useState("");
	const newTagInputRef = React.useRef<HTMLInputElement | null>(null);

	const addTag = (value: string) => {
		setTags((prev) => {
			if (prev.includes(value)) return prev;

			const tags = Array.from(new Set([...prev]));
			tags.push(value);

			setNewTag("");

			return tags;
		});
	};

	const removeLastTag = () => {
		setTags((prev) => {
			const tags = Array.from(new Set([...prev]));
			tags.pop();

			return tags;
		});
	};

	const removeTagByValue = (value: string) => {
		setTags((prev) => {
			const tags = Array.from(new Set([...prev])).filter(
				(item) => item !== value,
			);

			return tags;
		});
	};

	return (
		<div className="w-full flex flex-col space-y-2">
			<label htmlFor="tag" className="block">
				Tags
			</label>
			<div
				className={clsx(
					"text-black dark:text-white rounded outline-none border border-gray-300 focus:border-gray-400 caret-black flex flex-wrap px-2.5",
					tags.length > 0 && "space-x-4",
				)}
				onClick={() => {
					newTagInputRef.current?.focus();
				}}
			>
				<div className="flex flex-wrap overflow-hidden relative items-center space-x-1.5 h-8">
					{tags.map((item, idx) => {
						return (
							<Badge
								key={idx}
								title={item}
								className="z-50 border border-gray-300 h-6 text-xs bg-slate-100 hover:bg-slate-200 transition"
							>
								<button
									type="button"
									onClick={() => {
										removeTagByValue(item);
									}}
								>
									<HiX />
								</button>
							</Badge>
						);
					})}
				</div>
				<input
					id="tag"
					ref={newTagInputRef}
					type="text"
					autoComplete="off"
					value={newTag}
					onChange={(e) => setNewTag(e.target.value)}
					style={{
						width: `${newTag.length + 10}ch`,
						minWidth: "2rem",
						border: "unset",
						boxShadow: "unset",
					}}
					className="text-[inherit] cursor-[inherit] inline-block focus:outline-none text-sm focus:border-none focus:ring-none px-0 whitespace-pre-wrap break-words h-8 caret-black create-form-new-tag"
					onKeyDown={(e) => {
						const value = e.currentTarget.value.trim();

						switch (e.key.toLowerCase()) {
							case "enter": {
								e.preventDefault();
								if (value.length) addTag(value);
								break;
							}
							case "backspace": {
								if (!value.length) {
									e.preventDefault();
									removeLastTag();
								}
							}
						}
					}}
					list="tags"
				/>
			</div>
			<datalist id="tags">
				{data?.map((item) => {
					return <option key={item.id} value={item.name} />;
				})}
			</datalist>
			<p className="text-sm">Press enter to add tag</p>
		</div>
	);
}
