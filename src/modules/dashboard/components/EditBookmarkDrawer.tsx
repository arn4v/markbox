import clsx from "clsx";
import React from "react";
import { HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Badge from "~/components/Badge";
import Drawer, { DrawerContent } from "~/components/Drawer";
import {
	Bookmark,
	CreateOrUpdateBookmarkTagInput,
	useGetBookmarkQuery,
	useGetTagsQuery,
	useUpdateBookmarkMutation,
} from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import { omitKeys, pickKeys } from "~/lib/misc";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	id: string;
}

interface LocalState {
	title: string;
	url: string;
	tags: Record<string, CreateOrUpdateBookmarkTagInput>;
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

const EditBookmarkDrawer = ({ isOpen, onClose, id }: Props) => {
	const initialState: LocalState = {
		title: "",
		url: "",
		tags: {},
	};
	const [state, setState] = React.useState<LocalState>(initialState);
	const newTagInputRef = React.useRef<HTMLInputElement>(null);
	const { isLg } = useBreakpoints();
	const drawerPlacement = React.useMemo(() => {
		return isLg ? "right" : "bottom";
	}, [isLg]);

	// React query
	const queryClient = useQueryClient();
	const {} = useGetBookmarkQuery(
		{ id },
		{
			onSuccess(data) {
				const { title, url, tags } = data.bookmark;
				setState({
					title,
					url,
					tags: transformTags(tags),
				});
			},
		},
	);
	const { data } = useGetTagsQuery();
	const { mutate } = useUpdateBookmarkMutation({
		onSuccess: () => {
			queryClient.invalidateQueries([
				"GetAllBookmarks",
				"GetBookmark",
				"GetTags",
			]);
		},
	});

	const internalOnClose = () => {
		onClose();
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { title, url, tags } = state;
		mutate({ input: { id, title, url, tags: Object.values(tags) } });
		internalOnClose();
	};

	return (
		<Drawer isOpen={isOpen} onClose={internalOnClose}>
			<DrawerContent
				placement={drawerPlacement}
				className={clsx([
					"p-8 bg-blueGray-700",
					isLg ? "h-screen w-1/3 rounded-l-lg" : "w-screen h-1/2 rounded-t-lg",
				])}>
				<div className="w-full flex flex-col gap-6">
					<div className="w-full flex justify-between items-center">
						<h1 className="text-lg font-bold">Create new bookmark</h1>
						<button
							onClick={internalOnClose}
							className="p-2 rounded-lg bg-blueGray-600 focus:outline-none focus:ring ring-black hover:bg-blueGray-500 transition">
							<HiX />
							<span className="sr-only">Close drawer</span>
						</button>
					</div>
					<div className="mt-8">
						<form className="flex flex-col gap-4" onSubmit={onSubmit}>
							<div className="w-full">
								<label htmlFor="title" className="block">
									Name
								</label>
								<input
									id="title"
									type="text"
									className="rounded-lg block mt-2 w-full focus:outline-none focus:ring ring-black caret-black text-black"
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
									className="rounded-lg block mt-2 w-full focus:outline-none focus:ring ring-black caret-black text-black"
									value={state.url}
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
								<div className="mt-2 flex flex-wrap gap-2">
									{Object.values(state.tags).map((item) => {
										return (
											<Badge
												key={item.name}
												title={item?.name}
												variant="outline"
												color="white"
											/>
										);
									})}
								</div>
								<div className="mt-2 flex gap-6 w-full">
									<input
										id="tag"
										ref={newTagInputRef}
										type="text"
										className="rounded-lg block w-full focus:outline-none focus:ring ring-black caret-black text-black h-10"
										list="tags"
									/>
									<datalist id="tags">
										{data?.tags?.map((item) => {
											return <option key={item.id} value={item.name} />;
										})}
									</datalist>
									<button
										type="button"
										onClick={() => {
											const tagName = newTagInputRef.current.value.trim();
											setState((prev) => ({
												...prev,
												newTag: "",
												tags: {
													...prev.tags,
													[tagName]: {
														name: tagName,
													},
												},
											}));
											newTagInputRef.current.value = "";
										}}
										className="px-4 h-10 whitespace-nowrap text-sm grid place-items-center bg-blueGray-600 rounded-md">
										Add tag
									</button>
								</div>
							</div>
							<button
								type="submit"
								className="ml-auto px-4 py-2 bg-blueGray-600 hover:bg-blueGray-500 focus:ring ring-black focus:outline-none rounded-md mt-4 transition">
								Submit
							</button>
						</form>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default EditBookmarkDrawer;
