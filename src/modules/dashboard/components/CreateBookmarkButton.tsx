import * as React from "react";
import { HiPlus, HiX } from "react-icons/hi";
import useDisclosure from "~/hooks/use-disclosure";
import Drawer, { DrawerContent } from "~/components/Drawer";
import { useCreateBookmarkMutation } from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import clsx from "clsx";
import { useQueryClient } from "react-query";

export default function CreateBookmarkButton() {
	const { isOpen, onOpen, onClose: primaryOnClose } = useDisclosure();
	const queryClient = useQueryClient();
	const { isLg: lg } = useBreakpoints();
	const drawerPlacement = React.useMemo(() => {
		return lg ? "right" : "bottom";
	}, [lg]);
	const { mutate } = useCreateBookmarkMutation({
		onSuccess: () => {
			queryClient.invalidateQueries("GetAllBookmarks");
		},
	});
	const initialState = {
		title: "",
		url: "",
	};
	const [state, setState] = React.useState<typeof initialState>(initialState);

	const onClose = () => {
		primaryOnClose();
		setState(initialState);
	};

	return (
		<>
			<button
				className="w-full text-white font-medium items-center justify-center hover:bg-blueGray-600 flex px-2 py-2 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg gap-2 focus:outline-none"
				aria-haspopup={true}
				aria-expanded={isOpen}
				onClick={onOpen}>
				Create bookmark
				<HiPlus className="h-5 w-5" />
			</button>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent
					placement={drawerPlacement}
					className={clsx([
						"p-8 bg-blueGray-700",
						lg ? "h-screen w-1/3 rounded-l-lg" : "w-screen h-1/2 rounded-t-lg",
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
								mutate({ input: { ...state, tags: [] } });
								onClose();
							}}>
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
				</DrawerContent>
			</Drawer>
		</>
	);
}
