import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import { HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import create from "zustand";
import Badge from "~/components/Badge";
import Drawer, { DrawerContent } from "~/components/Drawer";
import {
	useCreateBookmarkMutation,
	useGetAllTagsQuery,
} from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import useStore from "./store";

export default function CreateBookmarkDrawer() {
	const initialState = {
		title: "",
		url: "",
		tags: {} as Record<string, { name: string }>,
	};
	const { isOpen, onClose: _onClose } = useStore();
	const [state, setState] = React.useState<typeof initialState>(initialState);
	const newTagInputRef = React.useRef<HTMLInputElement>(null);
	const { isLg: lg } = useBreakpoints();
	const drawerPlacement = React.useMemo(() => {
		return lg ? "right" : "bottom";
	}, [lg]);
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
			router.push(router.pathname, null, {
				shallow: true,
			});
			setState(initialState);
		});
	};

	return (
		<Drawer isOpen={isOpen} onClose={onClose}>
			<DrawerContent
				placement={drawerPlacement}
				className={clsx([
					"p-8 bg-blueGray-700",
					lg ? "h-screen w-1/3 rounded-l-lg" : "w-screen h-auto rounded-t-lg",
				])}>
				<div className="w-full flex justify-between items-center">
					<h1 className="text-lg font-bold">Create new bookmark</h1>
					<button
						onClick={onClose}
						className="p-2 rounded-lg bg-blueGray-600 focus:outline-none focus:ring ring-black hover:bg-blueGray-500 transition">
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
						}}>
						<div className="w-full">
							<label htmlFor="title" className="block">
								Name
							</label>
							<input
								id="title"
								type="text"
								className="rounded-lg block mt-2 w-full focus:outline-none focus:ring ring-black caret-black text-black h-10"
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
								className="rounded-lg block mt-2 w-full focus:outline-none focus:ring ring-black caret-black text-black h-10"
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
			</DrawerContent>
		</Drawer>
	);
}
