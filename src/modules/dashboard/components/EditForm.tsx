import isEqual from "lodash.isequal";
import React from "react";
import { HiX } from "react-icons/hi";
import Badge from "~/components/Badge";
import Input from "~/components/Input";
import { InferQueryOutput, trpc } from "~/lib/trpc";
import { useMixpanel } from "~/providers/Mixpanel";

interface Props {
	id: string;
	onSuccess: () => void;
}

type LocalTags = Record<string, true>;

const EditForm = ({ id, onSuccess }: Props) => {
	const mixpanel = useMixpanel();
	const initialState = {
		title: "",
		url: "",
		description: "",
		tags: {} as LocalTags,
		tagsDisconnect: {} as LocalTags,
	};
	const [state, setState] = React.useState(initialState);
	const newTagInputRef = React.useRef<HTMLInputElement>(null);
	trpc.useQuery(["bookmarks.byId", id], {
		onSuccess(data) {
			const _data = data as NonNullable<InferQueryOutput<"bookmarks.byId">>;
			if (isEqual(state, initialState)) {
				setState((prev) => ({
					...prev,
					title: _data.title,
					url: _data.url,
					description: _data.description,
					tags: _data?.tags.reduce((acc, cur) => {
						acc[cur?.name] = true;
						return acc;
					}, {} as LocalTags),
				}));
			}
		},
	});
	const { invalidateQueries } = trpc.useContext();
	const { data } = trpc.useQuery(["tags.all"]);
	const { mutate } = trpc.useMutation(["bookmarks.updateById"], {
		onSuccess(data) {
			mixpanel.track("Bookmark Updated", {
				id: data?.id,
				updatedAt: data?.updatedAt.toISOString(),
			});
			setState(initialState);
			invalidateQueries(["bookmarks.all"]);
			invalidateQueries(["bookmarks.byId", id]);
			onSuccess();
		},
	});

	const onSubmit = React.useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const { title, url, description, tags, tagsDisconnect } = state;

			const tagsCreate = Object.keys(tags).filter(
				(tagName) => !data?.find((tagObject) => tagObject.name === tagName),
			);

			const tagsConnect = data
				?.filter((item) => tags[item.name])
				.map((item) => item.id);

			mutate({
				id,
				title,
				description,
				url,
				tagsCreate,
				tagsConnect,
				tagsDisconnect: Object.keys(tagsDisconnect),
			});
		},
		[data, id, mutate, state],
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
					{Object.keys(state.tags).map((item) => {
						return (
							<Badge
								data-test="edit-tag-badge"
								key={item}
								title={item}
								className="z-50 dark:bg-gray-900 dark:border-gray-600 border border-gray-300"
							>
								<button
									data-test="edit-tag-delete"
									type="button"
									onClick={() => {
										setState((prev) => {
											const tags = prev.tags;
											delete tags[item];

											const toDisconnect: Record<string, true> = {};
											const existingTag = data?.find(
												({ name }) => name === item,
											);

											if (existingTag) {
												toDisconnect[existingTag?.id] = true;
											}

											return {
												...prev,
												tags,
												tagsDisconnect: {
													...prev.tagsDisconnect,
													...toDisconnect,
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
										[trimmedValue]: true,
									},
								}));
								if (newTagInputRef.current) newTagInputRef.current.value = "";
							}
						}}
						placeholder="Separate tags by typing comma (,)"
						className="block w-full"
						list="tags"
					/>
					<datalist id="tags">
						{data?.map((item) => {
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
