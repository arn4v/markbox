import clsx from "clsx";
import * as React from "react";
import { HiX } from "react-icons/hi";
import useFuse from "~/hooks/use-fuse";
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

	const { result } = useFuse({
		query: newTag,
		data: data?.filter((item) => !tags.includes(item.name)) ?? [],
		options: {
			keys: ["name"],
			threshold: 0.1,
			distance: 10,
		},
	});
	const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
	const newTagInputRef = React.useRef<HTMLInputElement | null>(null);

	React.useEffect(() => {
		if (newTag.length && result.length) {
			setActiveIndex(0);
		} else {
			setActiveIndex(null);
		}
	}, [newTag]);

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

	const onArrowKeyAction: React.KeyboardEventHandler<HTMLInputElement> = (
		e,
	) => {
		e.preventDefault();
		if (newTag.length) {
			if (result.length) {
				setActiveIndex((prev) => {
					let newIndex: number | null = null;
					if (typeof prev === "number") {
						switch (e.key.toLowerCase()) {
							case "arrowdown": {
								newIndex = prev === result.length - 1 ? 0 : prev + 1;
								break;
							}
							case "arrowup": {
								newIndex = prev === 0 ? result.length - 1 : prev - 1;
							}
						}
					}

					if (typeof newIndex === "number") return newIndex;
					return prev;
				});
			} else {
				setActiveIndex(null);
			}
		}
	};

	return (
		<div className="w-full flex flex-col space-y-2">
			<label htmlFor="tag" className="block">
				Tags
			</label>
			<div
				className={clsx(
					"text-black dark:text-white rounded outline-none border border-gray-300 focus:border-gray-400 caret-black flex flex-wrap px-2.5 relative min-h-[8] h-auto",
					tags.length > 0 && "space-x-4 py-2",
				)}
				onClick={() => {
					newTagInputRef.current?.focus();
				}}
			>
				<div className="flex flex-wrap overflow-hidden relative items-center gap-1.5 min-h-full h-auto">
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
					style={{
						width: `${newTag.length + 10}ch`,
						minWidth: "2rem",
						border: "unset",
						boxShadow: "unset",
					}}
					className="text-[inherit] cursor-[inherit] inline-block focus:outline-none text-sm focus:border-none focus:ring-none px-0 whitespace-pre-wrap break-words h-8 caret-black create-form-new-tag "
					onChange={(e) => setNewTag(e.target.value)}
					onKeyDown={(e) => {
						const value = e.currentTarget.value.trim();

						switch (e.key.toLowerCase()) {
							case "enter": {
								e.preventDefault();
								if (typeof activeIndex === "number") {
									addTag(result[activeIndex].name);
								} else {
									if (value.length) addTag(value);
								}
								break;
							}
							case "backspace": {
								if (value.length === 0) {
									e.preventDefault();
									removeLastTag();
								}
								break;
							}
							case "arrowdown": {
								onArrowKeyAction(e);
								break;
							}
							case "arrowup": {
								onArrowKeyAction(e);
								break;
							}
						}
					}}
				/>
				{newTag.length ? (
					<div
						className={clsx([
							"absolute top-full z-[100] w-full bg-white shadow-md text-xs left-0 mt-1 border border-slate-300 rounded",
						])}
					>
						<ul>
							{result.length ? (
								result?.map((item, idx) => (
									<li key={item.id} className="w-full">
										<button
											onClick={() => addTag(item.name)}
											className={clsx(
												activeIndex === idx && "bg-gray-200",
												"px-4 py-2 w-full text-left",
											)}
										>
											{item.name}
										</button>
									</li>
								))
							) : (
								<li>
									<button
										onClick={() => addTag(newTag)}
										className={clsx("px-4 py-2 w-full text-left bg-gray-200")}
									>
										Create {newTag}
									</button>
								</li>
							)}
						</ul>
					</div>
				) : null}
			</div>

			<p className="text-sm">Press enter to add tag</p>
		</div>
	);
}
