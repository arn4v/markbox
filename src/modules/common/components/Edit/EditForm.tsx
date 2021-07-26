import isEqual from "lodash.isequal";
import React from "react";
import { HiX } from "react-icons/hi";
import Badge from "~/components/Badge";
import Input from "~/components/Input";
import {
	Bookmark,
	CreateOrUpdateBookmarkTagInput,
	Tag,
	useGetAllTagsQuery,
	useGetBookmarkQuery,
	useUpdateBookmarkMutation
} from "~/graphql/types.generated";

interface LocalState {
	title: string;
	url: string;
	description: string;
	tags: Record<string, CreateOrUpdateBookmarkTagInput>;
	tagsDisconnect: Record<string, CreateOrUpdateBookmarkTagInput>;
}

const processServerTagsToClientNeeds = (
	data: Bookmark["tags"],
): Record<string, CreateOrUpdateBookmarkTagInput> => {
	return data.reduce((acc, { name }) => {
		acc[name] = { name };
		return acc;
	}, {});
};

const processClientTagsToServerNeeds = (
	data: Tag[],
	tags: LocalState["tags"],
	tagsDisconnect: LocalState["tagsDisconnect"],
) => {
	const transformedTags = Object.values(tags).reduce((acc, cur) => {
		if (tagsDisconnect[cur?.name]) delete tagsDisconnect[cur?.name];
		const existingTag = data.find((item) => item.name === cur.name);
		if (existingTag) {
			acc.push({ id: existingTag.id });
		} else {
			acc.push(cur);
		}
		return acc;
	}, []);

	const transformedTagsDisconnect = Object.values(tagsDisconnect).reduce(
		(acc, cur) => {
			const existingTag = data.find((item) => item.name === cur.name);
			if (existingTag) {
				acc.push({ id: existingTag.id });
			}

			return acc;
		},
		[],
	);

	return { tags: transformedTags, tagsDisconnect: transformedTagsDisconnect };
};

interface Props {
	id: string;
	onSuccess: () => void;
}

const EditForm = ({ id, onSuccess }: Props) => {
	const initialState: LocalState = {
		title: "",
		url: "",
		description: "",
		tags: {},
		tagsDisconnect: {},
	};
	const [state, setState] = React.useState<LocalState>(initialState);
	const newTagInputRef = React.useRef<HTMLInputElement>(null);
	useGetBookmarkQuery(
		{ id },
		{
			onSuccess(data) {
				console.log(data);
				if (isEqual(state, initialState)) {
					setState((prev) => ({
						...prev,
						title: data.bookmark.title,
						url: data.bookmark.url,
						description: data.bookmark.description,
						tags: processServerTagsToClientNeeds(data.bookmark.tags),
					}));
				}
			},
		},
	);
	const { data } = useGetAllTagsQuery();
	const { mutate } = useUpdateBookmarkMutation({
		onSuccess: (res) => {
			setState(initialState);
			onSuccess();
		},
	});

	const onSubmit = React.useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const { title, url, description } = state;

			const { tags, tagsDisconnect } = processClientTagsToServerNeeds(
				data.tags,
				state.tags,
				state.tagsDisconnect,
			);

			mutate({
				input: {
					id,
					title,
					description,
					url,
					tags,
					tagsDisconnect,
				},
			});
		},
		[data?.tags, id, mutate, state],
	);

	const onChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
		},
		[],
	);

	return (
		<form
			data-test="edit-form"
			className="flex flex-col gap-4"
			onSubmit={onSubmit}
		>
			<div className="w-full">
				<label htmlFor="title" className="block">
					Title
				</label>
				<Input
					data-test="edit-title"
					id="title"
					autoComplete="off"
					type="text"
					className="block w-full mt-2"
					placeholder="Title"
					onChange={onChange}
					value={state.title}
					required
				/>
			</div>
			<div className="w-full">
				<label htmlFor="url" className="block">
					URL
				</label>
				<Input
					data-test="edit-url"
					id="url"
					type="url"
					className="block w-full mt-2"
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
					data-test="edit-description"
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
								data-test="edit-tag-badge"
								key={item.name}
								title={item?.name}
								className="z-50 dark:bg-gray-900 dark:border-gray-600 border border-gray-300"
							>
								<button
									data-test="edit-tag-delete"
									type="button"
									onClick={() => {
										setState((prev) => {
											const tags = prev.tags;
											delete tags[item?.name];
											return {
												...prev,
												tags,
												tagsDisconnect: {
													...prev.tagsDisconnect,
													[item.name]: { name: item.name },
												},
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
						data-test="edit-tag"
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
						className="block w-full"
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
				data-test="edit-submit"
				type="submit"
				className="px-4 py-2 mt-4 ml-auto text-white transition bg-blue-600 rounded-md ring-offset-current ring-offset-2 focus:ring-2 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none"
			>
				Submit
			</button>
		</form>
	);
};

export default EditForm;
