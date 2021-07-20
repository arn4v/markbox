import clsx from "clsx";
import React from "react";
import { useGetAllTagsQuery } from "~/graphql/types.generated";
import useDisclosure from "~/hooks/use-disclosure";
import useDashboardStore from "../store";
import Tag from "./Tag";

const Sidebar = () => {
	const {
		isOpen: isEditModeEnabled,
		onClose: onEditModeDisabled,
		onToggle: onEditModeToggle,
	} = useDisclosure();
	const { data } = useGetAllTagsQuery(
		{},
		{
			initialData: { tags: [] },
			// Disable edit mode if there are no tags
			onSuccess(data) {
				if (data?.tags?.length === 0) {
					onEditModeDisabled();
				}
			},
		},
	);
	const { tag } = useDashboardStore();

	return (
		<>
			<style jsx scoped>
				{`
					.sidebar {
						height: calc(100vh - 5rem);
					}
				`}
			</style>
			<div className="hidden lg:block gap-6 px-6 bg-white border-r border-gray-200 dark:bg-transparent dark:border-gray-700 2xl:pl-0 2xl:pr-6 lg:w-72 dark:text-white overflow-y-scroll scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scrollbar scrollbar-thin py-8 sidebar fixed">
				<div className="h-auto flex flex-col items-start justify-start gap-4 w-full">
					<div className="flex items-center justify-between w-full">
						<h2
							className={clsx([
								"text-gray-900 dark:text-gray-400 font-bold uppercase text-lg",
							])}
						>
							Tags
						</h2>
						{/* Only show Edit mode button when user has created > 0 tags */}
						{data?.tags.length > 0 ? (
							<button
								className="px-2 py-0.5 dark:bg-gray-900 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition rounded-md text-sm focus:outline-none"
								onClick={onEditModeToggle}
							>
								{isEditModeEnabled ? "Dismiss" : "Edit"}
							</button>
						) : null}
					</div>
					<div className="flex flex-col items-center justify-start w-full gap-2">
						<Tag
							isEditModeEnabled={false}
							active={typeof tag === "undefined" || tag === "All"}
							data={{ id: undefined, name: "All" }}
						/>
						{data?.tags?.map((item) => {
							return (
								<Tag
									key={item.id}
									isEditModeEnabled={isEditModeEnabled}
									data={item}
									active={tag === item.name}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
