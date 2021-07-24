import clsx from "clsx";
import React from "react";
import { useGetAllTagsQuery } from "~/graphql/types.generated";
import useDashboardStore from "../store";
import TagsList from "./TagsList";

const Sidebar = () => {
	const { onToggle, isEnabled } = useDashboardStore((state) => state.edit_mode);
	const { data } = useGetAllTagsQuery({});

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
								onClick={onToggle}
							>
								{isEnabled ? "Dismiss" : "Edit"}
							</button>
						) : null}
					</div>
					<TagsList />
				</div>
			</div>
		</>
	);
};

export default Sidebar;
