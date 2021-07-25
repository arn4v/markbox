import format from "date-fns/format";
import { useRouter } from "next/router";
import * as React from "react";
import {
	HiOutlineExternalLink,
	HiOutlineMenu,
	HiOutlineTrash,
	HiPencil,
	HiTrash
} from "react-icons/hi";
import { useQueryClient } from "react-query";
import { useDisclosure } from "react-sensible";
import Badge from "~/components/Badge";
import DeleteModal from "~/components/DeleteModal";
import Popup from "~/components/Popup";
import { Bookmark, useDeleteBookmarkMutation } from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import { EditDrawer } from "~/modules/common/components/Edit";

interface Props {
	data: Bookmark;
}

const BookmarkCard = ({ data }: Props) => {
	const {
		isOpen: isDeleteOpen,
		onClose: onDeleteClose,
		onOpen: onDeleteOpen,
	} = useDisclosure();
	const queryClient = useQueryClient();
	const { mutate } = useDeleteBookmarkMutation({
		onSuccess: () => {
			queryClient.invalidateQueries("GetAllBookmarks");
			queryClient.invalidateQueries("GetAllTags");
		},
	});
	const {
		isOpen: isDropdownOpen,
		onClose: onDropdownClose,
		onToggle: onDropdownToggle,
	} = useDisclosure();
	const {
		isOpen: isDrawerOpen,
		onOpen: onDrawerOpen,
		onClose: onDrawerClose,
	} = useDisclosure();

	const date = React.useMemo(
		() => new Date(data?.createdAt),
		[data?.createdAt],
	);
	const { isLg } = useBreakpoints();
	const router = useRouter();

	React.useEffect(() => {
		if (isDrawerOpen && isLg) onDrawerOpen();
	}, [isLg, isDrawerOpen, onDrawerOpen]);

	return (
		<>
			<li
				data-test="bookmark-card"
				className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white h-auto"
			>
				<div className="flex flex-col items-start justify-center w-5/6 gap-1">
					<span className="text-xs">
						{/* Need to test the advantages/disadvantages of using IIFEs in JSX */}
						{`Created on ${format(date, "do MMMM, yyyy")} at ${format(
							date,
							"h:mmaa",
						)}`}
					</span>
					<div className="w-5/6 text-sm font-medium break-words">
						{data?.title}
					</div>
					<a
						href={data?.url}
						target="_blank"
						rel="noreferrer"
						className="w-3/4 text-xs text-gray-500 dark:text-gray-400 truncate whitespace-nowrap hover:text-gray-700 transition dark:hover:text-gray-300"
					>
						{data?.url}
					</a>
					<div className="flex gap-2 mt-1.5 flex-wrap">
						{Object.values(data?.tags).map((item) => {
							return (
								<Badge
									key={item.id}
									title={item.name}
									className="dark:bg-gray-800 border dark:border-gray-600 border-gray-300 bg-white"
								/>
							);
						})}
					</div>
				</div>
				<div className="flex flex-col items-end w-1/6 gap-3">
					<Popup
						isOpen={isDropdownOpen}
						onDismiss={onDropdownClose}
						placement="bottom"
						trigger={
							<button
								onClick={onDropdownToggle}
								aria-expanded={isDropdownOpen}
								data-test="bookmark-menu-trigger"
								aria-haspopup={true}
								className="p-1 text-black transition rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-white hidden lg:block"
							>
								<HiOutlineMenu className="w-5 h-5 fill-current" />
							</button>
						}
					>
						<ul className="flex flex-col w-48 mt-1 overflow-hidden bg-gray-100 border border-gray-300 rounded-lg dark:border-none dark:bg-gray-600">
							<li className="w-full border-b border-gray-300 dark:border-blueGray-400">
								<button
									data-test="bookmark-menu-edit"
									onClick={() => {
										if (isLg) {
											onDrawerOpen();
										} else {
											router.push("/edit/" + data?.id);
										}

										onDropdownClose();
									}}
									className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-gray-500 focus:outline-none hover:bg-gray-300"
								>
									Edit <HiPencil />
								</button>
							</li>
							<li className="w-full">
								<button
									data-test="bookmark-menu-delete"
									className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-gray-500 focus:outline-none hover:bg-gray-300"
									onClick={() => {
										onDeleteOpen();
										onDropdownClose();
									}}
								>
									Delete <HiTrash />
								</button>
							</li>
						</ul>
					</Popup>
					<div className="flex flex-col items-center gap-2 lg:hidden">
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
						<button
							type="button"
							onClick={onDeleteOpen}
							className="focus:outline-none"
						>
							<HiOutlineTrash />
						</button>
					</div>
				</div>
			</li>
			<DeleteModal
				onClose={onDeleteClose}
				isOpen={isDeleteOpen}
				onDelete={() => {
					mutate({ id: data?.id });
					onDeleteClose();
				}}
			/>
			<EditDrawer isOpen={isDrawerOpen} onClose={onDrawerClose} id={data?.id} />
		</>
	);
};

export default BookmarkCard;
