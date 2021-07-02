import clsx from "clsx";
import React from "react";
import { HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Badge from "~/components/Badge";
import Drawer, { DrawerContent } from "~/components/Drawer";
import {
	Bookmark,
	CreateOrUpdateBookmarkTagInput,
	useGetAllTagsQuery,
	useGetBookmarkQuery,
	useUpdateBookmarkMutation
} from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";

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
	const { refetch: refetchBookmark } = useGetBookmarkQuery(
		{ id },
		{
			onSuccess(data) {
				const { title, url, tags } = data.bookmark;
				console.log(tags);
				console.log(transformTags(tags));
				setState({
					title,
					url,
					tags: transformTags(tags),
				});
			},
		},
	);
	const { data } = useGetAllTagsQuery();
	const { mutate } = useUpdateBookmarkMutation({
		onSuccess: (res) => {
			queryClient.invalidateQueries("GetAllBookmarks");
			queryClient.invalidateQueries("GetAllTags");
			refetchBookmark();
		},
	});

	const internalOnClose = () => {
		onClose();
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { title, url } = state;
		const tags = Object.values(state.tags).reduce((acc, cur) => {
			const existingTag = data.tags.find((item) => item.name === cur.name);
			if (existingTag) {
				acc.push({ id: existingTag.id });
			} else {
				acc.push(cur);
			}
			return acc;
		}, []);
		mutate({ input: { id, title, url, tags } });
		internalOnClose();
	};

	return (
		<Drawer isOpen={isOpen} onClose={internalOnClose}>
			<DrawerContent
				placement={drawerPlacement}
				className={clsx([
					"p-8 bg-blueGray-700",
					isLg ? "h-screen w-1/3 rounded-l-lg" : "w-screen h-auto rounded-t-lg",
				])}
			>
				<div className="flex flex-col w-full gap-6">
					<div className="flex items-center justify-between w-full">
						<h1 className="text-lg font-bold">Edit bookmark</h1>
						<button
							onClick={internalOnClose}
							className="p-2 transition rounded-lg bg-blueGray-600 focus:outline-none focus:ring ring-black hover:bg-blueGray-500"
						>
							<HiX />
							<span className="sr-only">Close drawer</span>
						</button>
					</div>
					<div className="lg:mt-8">
						<form className="flex flex-col gap-4" onSubmit={onSubmit}>
							<div className="w-full">
								<label htmlFor="title" className="block">
									Name
								</label>
								<input
									id="title"
									autoComplete="off"
									type="text"
									className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring ring-black caret-black"
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
									className="block w-full mt-2 text-black rounded-lg focus:outline-none focus:ring ring-black caret-black"
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
											/>
										);
									})}
								</div>
								<div className="flex w-full gap-6 mt-2">
									<input
										id="tag"
										ref={newTagInputRef}
										type="text"
										autoComplete="off"
										className="block w-full h-10 text-black rounded-lg focus:outline-none focus:ring ring-black caret-black"
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
										className="grid h-10 px-4 text-sm rounded-md whitespace-nowrap place-items-center bg-blueGray-600"
									>
										Add tag
									</button>
								</div>
							</div>
							<button
								type="submit"
								className="px-4 py-2 mt-4 ml-auto transition rounded-md bg-blueGray-600 hover:bg-blueGray-500 focus:ring ring-black focus:outline-none"
							>
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
