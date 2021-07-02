import format from "date-fns/format";
import * as React from "react";
import { HiOutlineMenu, HiPencil, HiTrash } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Badge from "~/components/Badge";
import Popup from "~/components/Popup";
import { Bookmark, useDeleteBookmarkMutation } from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import useDisclosure from "~/hooks/use-disclosure";
import EditBookmarkDrawer from "./EditBookmarkDrawer";

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
	const { mutate } = useDeleteBookmarkMutation({
		onSuccess: () => {
			queryClient.invalidateQueries("GetAllBookmarks");
			queryClient.invalidateQueries("GetAllTags");
		},
	});
	const queryClient = useQueryClient();

	return (
		<div className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg dark:bg-blueGray-700">
			<div className="flex flex-col items-start justify-center w-5/6 gap-1">
				<span className="text-xs">
					{format(new Date(data?.createdAt), "do MMMM, yyyy")}
				</span>
				<div className="w-5/6 text-sm font-medium break-words">
					{data?.title}
				</div>
				<a
					href={data?.url}
					target="_blank"
					rel="noreferrer"
					className="w-3/4 text-xs text-gray-400 truncate whitespace-nowrap"
				>
					{data?.url}
				</a>
				<div className="flex gap-2 mt-1.5">
					{Object.values(data?.tags).map((item) => {
						return (
							<Badge
								key={item.id}
								title={item.name}
								variant="outline"
								color="white"
							/>
						);
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
								className="p-1 transition rounded-full hover:bg-gray-300 dark:hover:bg-blueGray-600 focus:outline-none"
							>
								<HiOutlineMenu className="w-5 h-5" />
							</button>
						}
					>
						<ul className="flex flex-col w-48 mt-1 overflow-hidden bg-gray-100 border border-gray-300 rounded-lg dark:border-none dark:bg-blueGray-600">
							<li className="w-full border-b border-gray-300 dark:border-blueGray-400">
								<button
									className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-blueGray-500 focus:outline-none hover:bg-gray-300"
									onClick={() => {
										onOpen();
										onDropdownClose();
									}}
								>
									Edit <HiPencil />
								</button>
							</li>
							<li className="w-full">
								<button
									className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-blueGray-500 focus:outline-none hover:bg-gray-300"
									onClick={() => {
										mutate({ id: data.id });
										onDropdownClose();
									}}
								>
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
							className="focus:outline-none"
						>
							<svg
								width="14"
								height="14"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
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
							className="focus:outline-none"
						>
							<HiPencil />
						</button>
					</>
				)}
			</div>
			<EditBookmarkDrawer isOpen={isOpen} onClose={onClose} id={data.id} />
		</div>
	);
};

export default BookmarkCard;
