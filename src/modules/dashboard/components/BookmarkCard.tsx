import * as React from "react";
import Badge from "~/components/Badge";
import Drawer, { DrawerContent } from "~/components/Drawer";
import Popup from "~/components/Popup";
import clsx from "clsx";
import format from "date-fns/format";
import useBreakpoints from "~/hooks/use-breakpoints";
import useDisclosure from "~/hooks/use-disclosure";
import { Bookmark, useDeleteBookmarkMutation } from "~/graphql/types.generated";
import { HiOutlineMenu, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { useQueryClient } from "react-query";

interface Props {
	data: Bookmark;
}

const BookmarkCard = ({ data }: Props) => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const {
		isOpen: isDropdownOpen,
		onClose: onDropdownClose,
		onToggle: onDropdownToggle,
	} = useDisclosure();
	const { isLg } = useBreakpoints();
	const drawerPlacement = React.useMemo(() => {
		return isLg ? "right" : "bottom";
	}, [isLg]);
	const { mutate } = useDeleteBookmarkMutation({
		onSuccess: () => {
			queryClient.invalidateQueries("GetAllBookmarks");
		},
	});
	const queryClient = useQueryClient();

	return (
		<div className="flex items-center justify-between w-full p-3 rounded-lg bg-blueGray-700">
			<div className="flex flex-col items-start justify-center w-5/6 gap-1">
				<span className="text-xs text-white">
					{format(new Date(data?.createdAt), "do MMMM, yyyy")}
				</span>
				<div className="text-sm font-medium w-5/6 break-words text-white">
					{data?.title}
				</div>
				<a
					href={data?.url}
					target="_blank"
					rel="noreferrer"
					className="w-3/4 text-xs text-gray-400 truncate whitespace-nowrap">
					{data?.url}
				</a>
				<div className="flex gap-2 mt-1.5">
					{Object.values(data?.tags).map((item) => {
						return <Badge key={item.id} title={item.name} variant="solid" />;
					})}
				</div>
			</div>
			<div className="flex flex-col items-end w-1/6 gap-3">
				{isLg ? (
					<Popup
						isOpen={isDropdownOpen}
						onDismiss={onDropdownClose}
						placement="bottom"
						trigger={
							<button
								onClick={onDropdownToggle}
								aria-expanded={isDropdownOpen}
								aria-haspopup={true}
								className="hover:bg-blueGray-600 rounded-full p-1 focus:outline-none transition">
								<HiOutlineMenu className="h-5 w-5" />
							</button>
						}>
						<ul className="w-48 dark:bg-blueGray-600 overflow-hidden rounded-lg mt-1 flex flex-col">
							<li className="w-full border-b border-blueGray-400">
								<button
									className="py-2 dark:hover:bg-blueGray-500 flex transition gap-2 items-center w-full justify-center focus:outline-none"
									onClick={() => {
										onOpen();
										onDropdownClose();
									}}>
									Edit <HiPencil />
								</button>
							</li>
							<li className="w-full">
								<button
									className="py-2 dark:hover:bg-blueGray-500 flex transition gap-2 items-center w-full justify-center focus:outline-none"
									onClick={() => {
										mutate({ id: data.id });
										onDropdownClose();
									}}>
									Delete <HiTrash />
								</button>
							</li>
						</ul>
					</Popup>
				) : (
					<>
						<a
							target="_blank"
							rel="noreferrer"
							href={data?.url}
							className="focus:outline-none">
							<svg
								width="14"
								height="14"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M13 1L5.5 8.5m0-6h-3A1.5 1.5 0 001 4v7.5A1.5 1.5 0 002.5 13H10a1.5 1.5 0 001.5-1.5v-3l-6-6zm3-1.5H13 8.5zM13 1v4.5V1z"
									stroke="#EDF2F7"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</a>
						<button
							type="button"
							onClick={onOpen}
							className="focus:outline-none">
							<HiPencil />
						</button>
					</>
				)}
			</div>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent
					placement={drawerPlacement}
					className={clsx([
						"p-8 bg-blueGray-700",
						isLg
							? "h-screen w-1/3 rounded-l-lg"
							: "w-screen h-1/2 rounded-t-lg",
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
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export default BookmarkCard;
