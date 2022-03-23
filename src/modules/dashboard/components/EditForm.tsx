import isEqual from "lodash.isequal";
import React from "react";
import Button from "~/components/Button";
import { Input } from "~/components/Input";
import { TagInput } from "~/components/TagInput";
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
	};
	const [tags, setTags] = React.useState<string[]>([]);
	const [state, setState] = React.useState(initialState);
	const { data: bookmark } = trpc.useQuery(["bookmarks.byId", id], {
		onSuccess(data) {
			const _data = data as NonNullable<InferQueryOutput<"bookmarks.byId">>;
			if (isEqual(state, initialState)) {
				setState((prev) => ({
					...prev,
					title: _data.title,
					url: _data.url,
					description: _data.description,
				}));
				setTags(
					_data?.tags.reduce((acc, cur) => {
						acc.push(cur.name);
						return acc;
					}, [] as string[]),
				);
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
			Promise.all([
				invalidateQueries(["bookmarks.all"]),
				invalidateQueries(["bookmarks.byId", id]),
			]).then(() => {
				onSuccess();
			});
		},
	});

	const onSubmit = React.useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const { title, url, description } = state;

			const tagsCreate = tags.filter(
				// item is the tag name
				(item) => !data?.find((tagObject) => tagObject.name === item),
			);

			// FIX: This seems very hacky
			const tagsConnect = tags
				.map((item) => data!.find((tag) => tag.name === item))
				.filter((item) => typeof item !== "undefined" && item !== null)
				.map((item) => item!.id);

			const tagsDisconnect = bookmark!.tags
				.filter((item) => !tags.includes(item.name))
				.map((item) => item.id);

			mutate({
				id,
				title,
				description,
				url,
				tagsCreate,
				tagsConnect,
				tagsDisconnect,
			});
		},
		[data, id, mutate, state, tags],
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
			<TagInput data={data!} tags={tags} setTags={setTags} />
			<Button data-test="edit-submit" type="submit" className="mt-4">
				Submit
			</Button>
		</form>
	);
};

export default EditForm;
