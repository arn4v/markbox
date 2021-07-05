import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import { HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Badge from "~/components/Badge";
import Drawer, { DrawerContent } from "~/components/Drawer";
import {
	useCreateBookmarkMutation,
	useGetAllTagsQuery
} from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import { omitKeys } from "~/lib/misc";
import useStore from "./store";

export default function CreateBookmarkDrawer() {
	const initialState = {
		title: "",
		url: "",
		tags: {} as Record<string, { name: string }>,
	};
	const { isOpen, onClose: _onClose, onOpen } = useStore();
	const [state, setState] = React.useState<typeof initialState>(initialState);
	const newTagInputRef = React.useRef<HTMLInputElement>(null);
	const { isLg } = useBreakpoints();
	const drawerPlacement = React.useMemo(() => {
		return isLg ? "right" : "bottom";
	}, [isLg]);
	const router = useRouter();

	// Data fetching/mutation
	const queryClient = useQueryClient();
	const { data } = useGetAllTagsQuery();
	const { mutate } = useCreateBookmarkMutation({
		onSuccess: () => {
			queryClient.invalidateQueries("GetAllBookmarks");
			queryClient.invalidateQueries("GetAllTags");
		},
	});

	const onClose = () => {
		_onClose(() => {
			router.push(
				"/dashboard",
				{ href: "/dashboard", query: omitKeys(router.query, "create") },
				{
					shallow: true,
				},
			);
			setState(initialState);
		});
	};

	return (
		<Drawer isOpen={isOpen} onClose={onClose}>
			<DrawerContent
				placement={drawerPlacement}
				className={clsx([
					"p-8 bg-white dark:bg-gray-900 dark:text-white",
					"lg:h-screen lg:w-1/3 lg:rounded-l-lg w-screen h-auto rounded-t-lg",
				])}
			>
				<div className="flex items-center justify-between w-full">
					<h1 className="text-lg font-bold">Create new bookmark</h1>
					<button
						onClick={onClose}
						className="p-2 transition bg-gray-100 rounded-lg dark:bg-gray-600 focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 dark:hover:bg-gray-500"
					>
						<HiX />
						<span className="sr-only">Close drawer</span>
					</button>
				</div>
				<div className="mt-8">
					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							const { title, url } = state;
							const tags = Object.values(state.tags).reduce((acc, cur) => {
								const existingTag = data?.tags.find(
									(item) => item.name === cur.name,
								);
								if (existingTag) {
									acc.push({ id: existingTag.id });
								} else {
									acc.push(cur);
								}
								return acc;
							}, []);
							mutate({ input: { title, url, tags } });
							onClose();
						}}
					>
						<div className="w-full">
							<label htmlFor="title" className="block">
								Name
							</label>
							<input
								id="title"
								type="text"
								className="block w-full h-10 mt-2 text-black rounded-lg focus:outline-none focus:ring ring-gray-300 dark:ring-black caret-black"
								onChange={(e) =>
									setState((prev) => ({ ...prev, title: e.target.value }))
								}
								value={state.title}
								autoComplete="off"
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
								className="block w-full h-10 mt-2 text-black rounded-lg focus:outline-none focus:ring ring-gray-300 dark:ring-black caret-black"
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
									className="block w-full h-10 text-black rounded-lg focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 caret-black"
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
							className="px-4 py-2 mt-4 ml-auto transition bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-600 hover:bg-gray-200 focus:border-transparent dark:border-transparent dark:hover:bg-gray-500 focus:ring-2 ring-offset-current ring-offset-2 focus:outline-none"
						>
							Submit
						</button>
					</form>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
