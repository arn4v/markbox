import * as React from "react";
import { HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Badge from "~/components/Badge";
import Input from "~/components/Input";
import {
	useCreateBookmarkMutation,
	useGetAllTagsQuery
} from "~/graphql/types.generated";

interface Props {
	title?: string;
	url?: string;
	onSuccess: (...args: unknown[]) => void;
}

const CreateForm = ({ title = "", url = "", onSuccess }: Props) => {
	const initialState = {
		title: "",
		url: "",
		description: "",
		tags: {} as Record<string, { name: string }>,
	};
	// Data fetching/mutation
	const queryClient = useQueryClient();
	const { data } = useGetAllTagsQuery();
	const { mutate } = useCreateBookmarkMutation({
		onSuccess: () => {
			// Invalidate GetAllBookmarks and GetAllTags on successful mutation
			queryClient.invalidateQueries("GetAllBookmarks");
			queryClient.invalidateQueries("GetAllTags");
			setState(initialState);
			onSuccess();
		},
	});
	const [state, setState] = React.useState<typeof initialState>({
		...initialState,
		title,
		url,
	});
	const newTagInputRef = React.useRef<HTMLInputElement>(null);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const { title, url, description } = state;
		// Transform tags to Array<{ id: string }>
		const tags = Object.values(state.tags).reduce((acc, cur) => {
			const existingTag = data?.tags.find((item) => item.name === cur.name);
			if (existingTag) {
				acc.push({ id: existingTag.id });
			} else {
				acc.push(cur);
			}
			return acc;
		}, []);
		mutate({ input: { title, url, description, tags } });
	};

	const onChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
		},
		[],
	);

	return (
		<form
			data-test="create-form"
			className="flex flex-col gap-4"
			onSubmit={onSubmit}
		>
			<div className="w-full">
				<label htmlFor="title" className="block">
					Title
				</label>
				<Input
					id="title"
					type="text"
					className="block w-full h-10 mt-2"
					placeholder="Name"
					value={state.title}
					onChange={onChange}
					autoComplete="off"
					required
				/>
			</div>
			<div className="w-full">
				<label htmlFor="url" className="block">
					URL
				</label>
				<Input
					id="url"
					type="url"
					className="block w-full h-10 mt-2"
					placeholder="URL"
					value={state.url}
					onChange={onChange}
					autoComplete="off"
					required
				/>
			</div>
			<div className="w-full">
				<label htmlFor="description" className="block">
					Description
				</label>
				<Input
					id="description"
					type="text"
					className="block w-full h-10 mt-2"
					placeholder="Description"
					value={state.description}
					onChange={onChange}
					autoComplete="off"
				/>
			</div>
			<div className="w-full">
				<label htmlFor="url" className="block">
					Tags
				</label>
				<div className="flex flex-wrap gap-2 mt-2">
					{Object.values(state.tags).map((item) => {
						return (
							<Badge
								key={item.name}
								title={item?.name}
								className="z-50 dark:bg-gray-900 dark:border-gray-600 border border-gray-300"
							>
								<button
									type="button"
									onClick={() => {
										setState((prev) => {
											const tags = prev.tags;
											delete tags[item?.name];
											return {
												...prev,
												tags,
											};
										});
									}}
								>
									<HiX />
								</button>
							</Badge>
						);
					})}
				</div>
				<div className="flex w-full gap-6 mt-2">
					<Input
						id="tag"
						ref={newTagInputRef}
						type="text"
						autoComplete="off"
						onChange={(e) => {
							let trimmedValue = e.target.value.trim();
							const lastIdx = trimmedValue.length - 1;
							if (trimmedValue.charAt(lastIdx) === ",") {
								trimmedValue = trimmedValue.slice(0, -1);
								setState((prev) => ({
									...prev,
									newTag: "",
									tags: {
										...prev.tags,
										[trimmedValue]: {
											name: trimmedValue,
										},
									},
								}));
								newTagInputRef.current.value = "";
							}
						}}
						placeholder="Separate tags by typing comma (,)"
						className="block w-full h-10"
						list="tags"
					/>
					<datalist id="tags">
						{data?.tags?.map((item) => {
							return <option key={item.id} value={item.name} />;
						})}
					</datalist>
				</div>
			</div>
			<button
				data-test="create-form-submit"
				type="submit"
				className="px-4 py-2 mt-4 ml-auto transition bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-600 hover:bg-gray-200 focus:border-transparent dark:border-transparent dark:hover:bg-gray-500 focus:ring-2 ring-offset-current ring-offset-2 focus:outline-none"
			>
				Submit
			</button>
		</form>
	);
};

export type { Props as CreateFormProps };
export default CreateForm;
