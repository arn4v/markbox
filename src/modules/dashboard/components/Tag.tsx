import * as React from "react";
import clsx from "clsx";
import Link from "next/link";
import { HiPencil, HiTrash } from "react-icons/hi";
import { useQueryClient } from "react-query";
import Popup from "~/components/Popup";
import {
	useDeleteTagMutation,
	useGetTagBookmarkCountQuery,
} from "~/graphql/types.generated";
import useDisclosure from "~/hooks/use-disclosure";

interface TagProps {
	children: string;
	redirect?: boolean;
	active: boolean;
	id: string;
	isEditModeEnabled: boolean;
}

export default function Tag({
	children,
	redirect = true,
	active,
	id,
	isEditModeEnabled,
}: TagProps) {
	const queryClient = useQueryClient();
	const { data, refetch } = useGetTagBookmarkCountQuery({ id });
	const { mutate } = useDeleteTagMutation({
		onSuccess() {
			queryClient.invalidateQueries("GetTags");
			refetch();
		},
	});
	const {
		isOpen: isDeleteOpen,
		onClose: onDeleteClose,
		onOpen: onDeleteOpen,
	} = useDisclosure();

	return (
		<li className="flex w-full gap-4 items-center">
			<Link
				href={{
					href: "/dashboard",
					query: redirect
						? {
								tag: encodeURIComponent(children.toLowerCase()),
						  }
						: {},
				}}
				shallow={true}>
				<a
					className={clsx([
						"px-4 py-2 flex-grow transition rounded-md",
						active
							? "bg-blueGray-600"
							: "bg-blueGray-700 hover:bg-blueGray-600",
					])}>
					{children}
				</a>
			</Link>
			{isEditModeEnabled && (
				<div className="flex items-center gap-4">
					<button
						className="py-2 dark:hover:bg-blueGray-500 flex transition gap-2 items-center justify-center focus:outline-none h-6 w-6 rounded-full"
						onClick={() => {}}>
						<HiPencil />
					</button>
					<Popup
						isOpen={isDeleteOpen}
						onDismiss={onDeleteClose}
						className="left-full ml-2 top-0"
						placement="custom"
						trigger={
							<button
								type="button"
								className="py-2 dark:hover:bg-blueGray-500 flex transition gap-2 items-center justify-center focus:outline-none rounded-full h-6 w-6"
								onClick={onDeleteOpen}>
								<HiTrash />
							</button>
						}>
						<div className="p-2 flex flex-col gap-4 w-56 bg-blueGray-700 rounded-lg">
							<div className="text-center">
								This tag is related to {data?.getTagBookmarkCount ?? 0}{" "}
								bookmarks. Do you really want to delete it?
							</div>
							<div className="w-full items-center flex justify-between">
								<button
									type="button"
									className="px-1 py-0.5 text-sm bg-red-500 hover:bg-red-600 rounded"
									onClick={onDeleteClose}>
									Dismiss
								</button>
								<button
									type="button"
									className="px-1 py-0.5 text-sm bg-red-500 hover:bg-red-600 rounded"
									onClick={() => {
										mutate({ id });
									}}>
									Delete
								</button>
							</div>
						</div>
					</Popup>
				</div>
			)}
		</li>
	);
}
