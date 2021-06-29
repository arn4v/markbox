import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiCog, HiLogout, HiMenu, HiOutlineTemplate } from "react-icons/hi";
import Drawer, { DrawerContent } from "~/components/Drawer";
import { useAuth } from "~/hooks/use-auth";
import useDisclosure from "~/hooks/use-disclosure";
import useStore from "./CreateBookmark";
import CreateBookmarkButton from "./CreateBookmark";
import { CardStackIcon } from "@radix-ui/react-icons";
import Tag from "./Tag";
import { useGetAllTagsQuery } from "~/graphql/types.generated";

export default function TagsDrawer(): JSX.Element {
	const { user } = useAuth();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { isOpen: isCreateOpen, onClose: onCreateClose } = useStore();
	const router = useRouter();
	const { data } = useGetAllTagsQuery();
	const {
		query: { tag },
	} = useRouter();

	return (
		<>
			<button
				onClick={() => {
					if (isCreateOpen) onCreateClose();
					onOpen();
				}}
				className="focus:outline-none"
			>
				<CardStackIcon className="w-5 h-5" />
			</button>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent
					placement="bottom"
					className="w-full h-auto py-8 rounded-t-lg dark:bg-blueGray-700"
				>
					<ul className={clsx(["flex flex-col w-full gap-4 px-6 text-base"])}>
						<h1 className="text-lg font-bold">Tags</h1>
						<div className="flex flex-col items-center justify-start w-full gap-4 my-2">
							<Tag
								id={undefined}
								isEditModeEnabled={false}
								redirect={false}
								active={typeof tag === "undefined"}
							>
								All
							</Tag>
							{data?.tags?.map((item) => {
								return (
									<Tag
										key={item.id}
										id={item.id}
										active={tag === item.name.toLowerCase()}
									>
										{item.name}
									</Tag>
								);
							})}
						</div>
					</ul>
				</DrawerContent>
			</Drawer>
		</>
	);
}
