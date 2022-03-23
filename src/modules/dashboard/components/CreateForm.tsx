import clsx from "clsx";
import * as React from "react";
import { HiX } from "react-icons/hi";
import Badge from "~/components/Badge";
import Button from "~/components/Button";
import { FormField } from "~/components/FormField";
import { trpc } from "~/lib/trpc";
import { useMixpanel } from "~/providers/Mixpanel";

interface Props {
	title?: string;
	url?: string;
	onSuccess: Function;
}

const CreateForm = ({ title = "", url = "", onSuccess }: Props) => {
	const initialState = {
		title: "",
		url: "",
		description: "",
		tags: [] as string[],
	};
	const { invalidateQueries } = trpc.useContext();
	const { data } = trpc.useQuery(["tags.all"]);
	const mixpanel = useMixpanel();
	const { mutate, isLoading } = trpc.useMutation(["bookmarks.create"], {
		onSuccess(data) {
			// Invalidate GetAllBookmarks and GetAllTags on successful mutation
			invalidateQueries(["bookmarks.all"]);
			invalidateQueries(["tags.all"]);
			setState(initialState);
			mixpanel.track("Bookmark Created", {
				id: data?.id,
				title: data?.title,
				url: data?.url,
				tags: data?.tags?.map((item) => item?.name),
			});
			onSuccess();
		},
	});
	const [state, setState] = React.useState<typeof initialState>({
		...initialState,
		title,
		url,
	});
	const [newTag, setNewTag] = React.useState("");
	const newTagInputRef = React.useRef<HTMLInputElement>(null);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const { title, url, description } = state;
		const { tagsConnect, tagsCreate } = state.tags.reduce(
			(acc, cur) => {
				const existingTag = data?.find((item) => item.name === cur);
				if (existingTag) {
					acc.tagsConnect.push(existingTag.id);
				} else {
					acc.tagsCreate.push(cur);
				}
				return acc;
			},
			{ tagsConnect: [], tagsCreate: [] } as {
				tagsConnect: string[];
				tagsCreate: string[];
			},
		);
		mutate({ title, url, description, tagsConnect, tagsCreate });
	};

	const onChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
		},
		[],
	);

	const addTag = (value: string) => {
		setState((prev) => {
			if (prev.tags.includes(value)) return prev;

			const tags = Array.from(new Set([...prev.tags]));
			tags.push(value);

			newTagInputRef.current!.value = "";
			setNewTag("");

			return {
				...prev,
				tags,
			};
		});
	};

	const removeLastTag = () => {
		setState((prev) => {
			const tags = Array.from(new Set([...prev.tags]));
			tags.pop();

			return {
				...prev,
				tags,
			};
		});
	};

	const removeTagByValue = (value: string) => {
		setState((prev) => {
			const tags = Array.from(new Set([...prev.tags])).filter(
				(item) => item === value,
			);

			return {
				...prev,
				tags,
			};
		});
	};

	return (
		<>
			<form
				data-test="create-form"
				className="flex flex-col space-y-4"
				onSubmit={onSubmit}
			>
				<FormField
					label="Title"
					id="title"
					type="text"
					placeholder="Name"
					value={state.title}
					onChange={onChange}
					maxLength={700}
					autoComplete="off"
					required
				/>
				<FormField
					label="URL"
					id="url"
					type="url"
					placeholder="URL"
					value={state.url}
					onChange={onChange}
					autoComplete="off"
					maxLength={1000}
					required
				/>
				<FormField
					label="Description"
					id="description"
					type="text"
					placeholder="Description"
					value={state.description}
					onChange={onChange}
					autoComplete="off"
				/>
				<div className="w-full flex flex-col space-y-2">
					<label htmlFor="tag" className="block">
						Tags
					</label>
					<div
						className={clsx(
							"text-black dark:text-white rounded outline-none border border-gray-300 focus:border-gray-400 caret-black flex flex-wrap px-2.5",
							state.tags.length > 0 && "space-x-4",
						)}
						onClick={() => {
							newTagInputRef.current?.focus();
						}}
					>
						<div className="flex flex-wrap overflow-hidden relative items-center space-x-1.5 h-8">
							{state.tags.map((item) => {
								return (
									<Badge
										key={item}
										title={item}
										className="z-50 border border-gray-300 h-6 text-xs bg-slate-100 hover:bg-slate-200 transition"
									>
										<button
											type="button"
											onClick={() => removeTagByValue(item)}
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
				<Button
					data-test="create-form-submit"
					type="submit"
					theme="primary"
					isLoading={isLoading}
					disabled={isLoading}
					className="ml-auto px-4 mt-4"
				>
					Submit
				</Button>
			</form>
		</>
	);
};

export type { Props as CreateFormProps };
export default CreateForm;
