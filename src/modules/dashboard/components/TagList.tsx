import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import { useGetAllTagsQuery } from "~/graphql/types.generated";
import useDisclosure from "~/hooks/use-disclosure";
import Tag from "./Tag";

export default function TagList() {
	const {
		isOpen: isEditModeEnabled,
		onOpen: onEditModeEnabled,
		onClose: onEditModeDisabled,
		onToggle: onEditModeToggle,
	} = useDisclosure();
	const { data } = useGetAllTagsQuery(
		{},
		{
			initialData: { tags: [] },
			onSuccess(data) {
				if (data?.tags?.length!) {
					onEditModeDisabled();
				}
			},
		},
	);
	const {
		query: { tag },
	} = useRouter();

	return (
		<div className="flex flex-col w-full items-center">
			<div className="w-full flex items-center justify-between my-2">
				<h2
					className={clsx([
						"text-gray-900 dark:text-gray-400 font-bold uppercase text-lg",
					])}
				>
					Tags
				</h2>
				<button
					className="px-2 py-0.5 bg-blueGray-700 hover:bg-blueGray-600 transition rounded-md text-sm focus:outline-none"
					onClick={onEditModeToggle}
				>
					{isEditModeEnabled ? "Dismiss" : "Edit"}
				</button>
			</div>
			<div className="my-2 w-full flex flex-col items-center justify-start gap-2">
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
							isEditModeEnabled={isEditModeEnabled}
							active={tag === item.name.toLowerCase()}
						>
							{item.name}
						</Tag>
					);
				})}
			</div>
		</div>
	);
}
