import clsx from "clsx";
import { useRouter } from "next/router";
import QueryString from "qs";
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
	const router = useRouter();

	return (
		<div className="flex flex-col items-center w-full">
			<div className="flex items-center justify-between w-full my-2">
				<h2
					className={clsx([
						"text-gray-900 dark:text-gray-400 font-bold uppercase text-lg",
					])}
				>
					Tags
				</h2>
				{data?.tags.length > 0 && (
					<button
						className="px-2 py-0.5 dark:bg-gray-900 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition rounded-md text-sm focus:outline-none"
						onClick={onEditModeToggle}
					>
						{isEditModeEnabled ? "Dismiss" : "Edit"}
					</button>
				)}
			</div>
			<div className="flex flex-col items-center justify-start w-full gap-2 my-2">
				<Tag
					isEditModeEnabled={false}
					active={typeof router.query.tag === "undefined"}
					href="/dashboard"
					data={{ id: undefined, name: "All" }}
				/>
				{data?.tags?.map((item) => {
					return (
						<Tag
							key={item.id}
							isEditModeEnabled={isEditModeEnabled}
							data={item}
							href={
								"/dashboard?" +
								QueryString.stringify({
									tag: encodeURIComponent(item.name.toLowerCase()),
								})
							}
							active={router.query?.tag === item.name.toLowerCase()}
						/>
					);
				})}
			</div>
		</div>
	);
}
