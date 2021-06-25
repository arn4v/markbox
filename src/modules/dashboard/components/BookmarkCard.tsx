import * as React from "react";
import Badge from "~/components/Badge";
import format from "date-fns/format";
import { Bookmark } from "~/graphql/types.generated";
import useDisclosure from "~/hooks/use-disclosure";
import { HiChevronDown, HiPencil, HiX } from "react-icons/hi";
import Drawer, { DrawerContent } from "~/components/Drawer";
import useBreakpoints from "~/hooks/use-breakpoints";
import clsx from "clsx";
import Popup from "~/components/Popup";

interface Props {
	data: Bookmark;
}

const BookmarkCard = ({ data }: Props) => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { isLg } = useBreakpoints();

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
						isOpen={isOpen}
						onDismiss={onClose}
						button={
							<button onClick={onOpen}>
								<HiChevronDown />
							</button>
						}>
						<div></div>
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
			<Drawer isOpen={!isLg && isOpen} onClose={onClose}>
				<DrawerContent
					placement="right"
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
