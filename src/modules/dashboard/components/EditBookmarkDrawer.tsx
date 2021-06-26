import clsx from "clsx";
import React from "react";
import { HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Drawer, { DrawerContent } from "~/components/Drawer";
import { Bookmark, useUpdateBookmarkMutation } from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import { omitKeys } from "~/lib/misc";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	data: Bookmark;
}

const EditBookmarkDrawer = ({ isOpen, onClose, data }: Props) => {
	const { mutate } = useUpdateBookmarkMutation({
		onSuccess: (res) => {
			queryClient.invalidateQueries("GetAllBookmarks");
		},
	});
	const [state, setState] = React.useState<Bookmark>(data);
	const { isLg } = useBreakpoints();
	const drawerPlacement = React.useMemo(() => {
		return isLg ? "right" : "bottom";
	}, [isLg]);
	const queryClient = useQueryClient();

	const internalOnClose = () => {
		setState(data);
		onClose();
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const mutationInput = omitKeys(
			state,
			"__typename",
			"updatedAt",
			"createdAt",
		);
		mutate({ input: mutationInput });
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
