import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { Tag as TagType } from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import useDisclosure from "~/hooks/use-disclosure";
import DeleteTagPopup from "./DeleteTag";
import EditTagPopup from "./EditTag";

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
						"px-4 py-2 flex-grow transition rounded-md dark:text-white",
						isDeleteOpen && "z-30",
						active
							? "dark:bg-gray-500 lg:dark:bg-gray-600 bg-gray-200 font-medium"
							: "lg:dark:bg-gray-900 lg:dark:hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 bg-gray-100 hover:bg-gray-200",
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
