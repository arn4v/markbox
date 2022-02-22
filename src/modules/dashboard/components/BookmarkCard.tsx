import format from "date-fns/format";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import * as React from "react";
import {
	HiChevronDown,
	HiOutlineExternalLink,
	HiOutlineMenu,
	HiOutlineStar,
	HiOutlineTrash,
	HiPencil,
	HiStar,
	HiTrash,
} from "react-icons/hi";
import { useDisclosure } from "react-sensible";
import Badge from "~/components/Badge";
import Popup from "~/components/Popup";
import useBreakpoints from "~/hooks/use-breakpoints";
import { InferQueryOutput, trpc } from "~/lib/trpc";
import { useMixpanel } from "~/providers/Mixpanel";
import DescriptionModal from "./DescriptionModal";

const EditDrawer = dynamic(
	() => import("~/modules/dashboard/components/EditDrawer"),
);

const DeleteModal = dynamic(() => import("~/components/DeleteModal"));

interface Props {
	data: InferQueryOutput<"bookmarks.byId">;
}

const BookmarkCard = ({ data }: Props) => {
	const {
		isOpen: isDeleteOpen,
		onClose: onDeleteClose,
		onOpen: onDeleteOpen,
	} = useDisclosure();
	const { invalidateQueries } = trpc.useContext();
	const mixpanel = useMixpanel();
	const { mutate } = trpc.useMutation("bookmarks.deleteById", {
		onSuccess() {
			mixpanel.track("Bookmark Deleted");
			invalidateQueries(["bookmarks.all"]);
			invalidateQueries(["tags.all"]);
		},
	});
	const { mutate: updateFavourite } = trpc.useMutation("bookmarks.favourite", {
		onSuccess(isFavourited) {
			mixpanel.track(
				isFavourited
					? "Bookmark Added to Favourites"
					: "Bookmark Removed From Favourites",
				{
					id: data?.id,
				},
			);
			invalidateQueries(["bookmarks.all"]);
		},
	});
	const [isDropdownOpen, _, onDropdownClose, onDropdownToggle] =
		useDisclosure();
	const [isDrawerOpen, onDrawerOpen, onDrawerClose] = useDisclosure();
	const [isDescOpen, onDescOpen, onDescClose] = useDisclosure();
	const { isLg } = useBreakpoints();
	const router = useRouter();

	const onFavourite = React.useCallback(() => {
		if (!data?.id) return null;

		return updateFavourite({
			id: data?.id,
			isFavourite: !data?.isFavourite,
		});
	}, [data?.id, data?.isFavourite, updateFavourite]);

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
						{`Created on ${format(
							data?.createdAt,
							"do MMMM, yyyy",
						)} at ${format(data?.createdAt, "h:mmaa")}`}
					</span>
					<div
						data-test="bookmark-title"
						className="w-5/6 text-sm font-medium break-words"
					>
						{data?.title}
					</div>
					<a
						href={data?.url}
						data-test="bookmark-url"
						target="_blank"
						rel="noreferrer"
						className="w-3/4 text-xs text-gray-500 dark:text-gray-400 truncate whitespace-nowrap hover:text-gray-700 transition dark:hover:text-gray-300"
					>
						{data?.url}
					</a>
					{data?.description.length > 0 ? (
						<div className="flex flex-col space-y-2 px-2 py-2 w-full bg-gray-200 dark:bg-gray-800 rounded-md mt-2">
							<span data-test="description" className="truncate">
								{data?.description.length >= 50
									? `${data?.description.substring(0, 49)}...`
									: data?.description}
							</span>
							{data?.description.length >= 50 ? (
								<button
									data-test="expand-description-button"
									className="mx-auto px-1 dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-300 hover:bg-gray-400 transition rounded-lg py-0.5"
									onClick={onDescOpen}
								>
									<HiChevronDown />
								</button>
							) : null}
						</div>
					) : null}
					<div className="flex gap-2 mt-1.5 flex-wrap">
						{Object.values(data?.tags).map((item) => {
							return (
								<Badge
									data-test="tag-badge"
									key={item.id}
									title={item.name}
									className="dark:bg-gray-800 border dark:border-gray-600 border-gray-300 bg-white"
								/>
							);
						})}
					</div>
				</div>
				<div className="flex flex-col items-center gap-3">
					<button onClick={onFavourite}>
						{data.isFavourite ? (
							<HiStar className="text-yellow-500 h-4 w-4" />
						) : (
							<HiOutlineStar className="h-4 w-4" />
						)}
					</button>
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
					mutate(data?.id);
					onDeleteClose();
				}}
			/>
			<EditDrawer isOpen={isDrawerOpen} onClose={onDrawerClose} id={data?.id} />
			<DescriptionModal
				isOpen={isDescOpen}
				onClose={onDescClose}
				data={data?.description}
			/>
		</>
	);
};

export default BookmarkCard;
