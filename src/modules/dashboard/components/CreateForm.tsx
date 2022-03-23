import * as React from "react";
import Button from "~/components/Button";
import { FormField } from "~/components/FormField";
import { TagInput } from "~/components/TagInput";
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
	const [tags, setTags] = React.useState<string[]>([]);
	const newTagInputRef = React.useRef<HTMLInputElement>(null);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const { title, url, description } = state;
		const { tagsConnect, tagsCreate } = tags.reduce(
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
				<TagInput data={data!} tags={tags} setTags={setTags} />
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
