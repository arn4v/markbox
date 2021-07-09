import format from "date-fns/format";
import { useRouter } from "next/router";
import * as React from "react";
import {
	HiOutlineExternalLink,
	HiOutlineMenu,
	HiPencil,
	HiTrash
} from "react-icons/hi";
import { useQueryClient } from "react-query";
import Badge from "~/components/Badge";
import Popup from "~/components/Popup";
import { Bookmark, useDeleteBookmarkMutation } from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import useDisclosure from "~/hooks/use-disclosure";
import EditBookmarkDrawer from "../../common/components/Edit/EditBookmarkDrawer";

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
	const router = useRouter();

	return (
		<div className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white">
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
								className="p-1 text-black transition rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-white"
							>
								<HiOutlineMenu className="w-5 h-5 fill-current" />
							</button>
						}
					>
						<ul className="flex flex-col w-48 mt-1 overflow-hidden bg-gray-100 border border-gray-300 rounded-lg dark:border-none dark:bg-gray-600">
							<li className="w-full border-b border-gray-300 dark:border-blueGray-400">
								<button
									className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-gray-500 focus:outline-none hover:bg-gray-300"
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
									className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-gray-500 focus:outline-none hover:bg-gray-300"
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
							className="focus:outline-none dark:text-white text-black"
						>
							<HiOutlineExternalLink />
						</a>
						<button
							type="button"
							onClick={() => router.push("/edit/" + data.id)}
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
