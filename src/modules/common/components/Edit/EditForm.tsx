import isEqual from "lodash.isequal";
import React from "react";
import { HiOutlineXCircle } from "react-icons/hi";
import Badge from "~/components/Badge";
import {
	Bookmark,
	CreateOrUpdateBookmarkTagInput,
	useGetAllTagsQuery,
	useGetBookmarkQuery,
	useUpdateBookmarkMutation
} from "~/graphql/types.generated";

interface LocalState {
	title: string;
	url: string;
	tags: Record<string, CreateOrUpdateBookmarkTagInput>;
	tagsDisconnect: Record<string, CreateOrUpdateBookmarkTagInput>;
}

/**
 * The backend needs to be provided an array of objects
 * with following structure for it to be able to make the
 * database connections or create new tags if it doesn't
 * exist
 *
 * ```
 * {
 *  name: string
 * }
 * ```
 * Hence the requirement for transforming it
 */
const transformTags = (
	data: Bookmark["tags"],
): Record<string, CreateOrUpdateBookmarkTagInput> => {
	return data.reduce((acc, { name }) => {
		acc[name] = { name };
		return acc;
	}, {});
};

interface Props {
	id: string;
	onSuccess: () => void;
}

const EditForm = ({ id, onSuccess }: Props) => {
	const initialState: LocalState = {
		title: "",
		url: "",
		tags: {},
		tagsDisconnect: {},
	};
	const [state, setState] = React.useState<LocalState>(initialState);
	const newTagInputRef = React.useRef<HTMLInputElement>(null);
	const {} = useGetBookmarkQuery(
		{ id },
		{
			onSuccess(data) {
				if (isEqual(state, initialState)) {
					const { title, url, tags } = data.bookmark;
					setState((prev) => ({
						...prev,
						title,
						url,
						tags: transformTags(tags),
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

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { title, url, tagsDisconnect } = state;
		const tags = Object.values(state.tags).reduce((acc, cur) => {
			if (tagsDisconnect[cur?.name]) delete tagsDisconnect[cur?.name];
			const existingTag = data.tags.find((item) => item.name === cur.name);
			if (existingTag) {
				acc.push({ id: existingTag.id });
			} else {
				acc.push(cur);
			}
			return acc;
		}, []);
		const _tagsDisconnect = Object.values(tagsDisconnect).reduce((acc, cur) => {
			const existingTag = data.tags.find((item) => item.name === cur.name);
			if (existingTag) {
				acc.push({ id: existingTag.id });
			}

			return acc;
		}, []);

		mutate({
			input: {
				id,
				title,
				url,
				tags,
				tagsDisconnect: _tagsDisconnect,
			},
		});
	};

	return (
		<form className="flex flex-col gap-4" onSubmit={onSubmit}>
			<div className="w-full">
				<label htmlFor="title" className="block">
					Name
				</label>
				<input
					id="title"
					autoComplete="off"
					type="text"
					className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-blue-600 ring-offset-2 caret-black"
					onChange={(e) =>
						setState((prev) => ({ ...prev, title: e.target.value }))
					}
					value={state.title}
					required
				/>
			</div>
			<div className="w-full">
				<label htmlFor="url" className="block">
					URL
				</label>
				<input
					id="url"
					type="url"
					className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-blue-600 ring-offset-2 caret-black"
					value={state.url}
					autoComplete="off"
					onChange={(e) =>
						setState((prev) => ({ ...prev, url: e.target.value }))
					}
					required
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
								variant="outline"
								color="white"
								className="z-50"
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
												tagsDisconnect: {
													...prev.tagsDisconnect,
													[item.name]: { name: item.name },
												},
											};
										});
									}}
								>
									<HiOutlineXCircle />
								</button>
							</Badge>
						);
					})}
				</div>
				<div className="flex w-full gap-6 mt-2">
					<input
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
						className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-current ring-blue-600 ring-offset-2 caret-black"
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
				type="submit"
				className="px-4 py-2 mt-4 ml-auto text-white transition bg-blue-600 rounded-md ring-offset-current ring-offset-2 focus:ring-2 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none"
			>
				Submit
			</button>
		</form>
	);
};

export default EditForm;
