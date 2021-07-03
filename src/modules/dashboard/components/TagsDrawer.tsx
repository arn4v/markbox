import { CardStackIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useRouter } from "next/router";
import QueryString from "qs";
import React from "react";
import Drawer, { DrawerContent } from "~/components/Drawer";
import { useGetAllTagsQuery } from "~/graphql/types.generated";
import { useAuth } from "~/hooks/use-auth";
import useDisclosure from "~/hooks/use-disclosure";
import { omitKeys } from "~/lib/misc";
import useStore from "./CreateBookmark";
import Tag from "./Tag";

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
				className="focus:outline-none dark:text-white"
			>
				<CardStackIcon className="w-5 h-5" />
			</button>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerContent
					placement="bottom"
					className="w-full h-auto py-8 bg-white rounded-t-lg dark:bg-gray-900"
				>
					<ul className={clsx(["flex flex-col w-full gap-4 px-6 text-base"])}>
						<h1 className="text-lg font-bold dark:text-white">Tags</h1>
						<div className="flex flex-col items-center justify-start w-full gap-4 my-2">
							<Tag
								isEditModeEnabled={false}
								data={{ id: "", name: "All" }}
								href={`/dashboard?${QueryString.stringify(
									omitKeys(router.query, "tag"),
								)}`}
								active={typeof tag === "undefined"}
							/>
							{data?.tags?.map((item) => {
								return (
									<Tag
										key={item.id}
										data={item}
										active={tag === item.name.toLowerCase()}
										isEditModeEnabled={false}
										href={`/dashboard?${QueryString.stringify({
											...router.query,
											tag: item.name,
										})}`}
									/>
								);
							})}
						</div>
					</ul>
				</DrawerContent>
			</Drawer>
		</>
	);
}
