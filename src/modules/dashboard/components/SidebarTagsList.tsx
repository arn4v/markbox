import clsx from "clsx";
import { trpc } from "~/lib/trpc";
import { useStore } from "~/store";
import TagsList from "./TagsList";

export const SidebarTagsList = () => {
	const { actions, isEnabled } = useStore((state) => state.editMode);
	const { data } = trpc.useQuery(["tags.all"]);

	return (
		<div className="h-auto flex flex-col items-start justify-start gap-4 w-full px-6 mb-6">
			<div className="flex items-center justify-between w-full">
				<h2
					className={clsx([
						"text-gray-900 dark:text-gray-400 font-bold uppercase text-lg",
					])}
				>
					Tags
				</h2>
				{/* Only show Edit mode button when user has created > 0 tags */}
				{data && data?.length > 0 ? (
					<button
						className="px-2 py-0.5 dark:bg-gray-900 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition rounded-md text-sm focus:outline-none"
						onClick={actions.onToggle}
					>
						{isEnabled ? "Dismiss" : "Edit"}
					</button>
				) : null}
			</div>
			<TagsList />
		</div>
	);
};
