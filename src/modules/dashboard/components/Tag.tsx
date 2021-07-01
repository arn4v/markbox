import * as React from "react";
import clsx from "clsx";
import { Tag as TagType, useGetTagQuery } from "~/graphql/types.generated";
import useDisclosure from "~/hooks/use-disclosure";
import EditTagPopup from "./EditTag";
import DeleteTagPopup from "./DeleteTag";
import useBreakpoints from "~/hooks/use-breakpoints";
import Link from "next/link";

interface TagProps {
	data: TagType;
	href: string;
	active: boolean;
	isEditModeEnabled?: boolean;
}

export default function Tag({
	active,
	isEditModeEnabled = false,
	data,
	href,
}: TagProps) {
	const {
		isOpen: isDeleteOpen,
		onClose: onDeleteClose,
		onOpen: onDeleteOpen,
	} = useDisclosure();
	const {
		isOpen: isEditOpen,
		onClose: onEditClose,
		onOpen: onEditOpen,
	} = useDisclosure();
	const { isLg } = useBreakpoints();

	return (
		<li className={clsx(["flex w-full gap-4 items-center"])}>
			<Link href={href}>
				<a
					className={clsx([
						"px-4 py-2 flex-grow transition rounded-md",
						isDeleteOpen && "z-30",
						active
							? isLg
								? "bg-blueGray-600"
								: "bg-blueGray-500"
							: isLg
							? "bg-blueGray-700 hover:bg-blueGray-600"
							: "bg-blueGray-600 hover:bg-blueGray-500",
					])}
				>
					{data.name}
				</a>
			</Link>
			{isEditModeEnabled && (
				<div className="flex items-center gap-4">
					<EditTagPopup
						data={data}
						isOpen={isEditOpen}
						onClose={onEditClose}
						onOpen={onEditOpen}
					/>
					<DeleteTagPopup
						data={data}
						isOpen={isDeleteOpen}
						onClose={onDeleteClose}
						onOpen={onDeleteOpen}
					/>
				</div>
			)}
		</li>
	);
}
