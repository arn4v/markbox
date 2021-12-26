import { CreateBookmarkButton } from "~/modules/common/components/Create";

/**
 * @name NoDataWarning
 * @description Component to show when user has no bookmarks
 */
const NoDataWarning = ({ isVisible }: { isVisible: boolean }) => {
	if (!isVisible) return null;

	return (
		<div
			data-test="dashboard-no-data-warning"
			className="flex flex-col items-center justify-center gap-8 py-8 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white"
		>
			<span className="text-xl font-medium text-center">
				You don&apos;t have any bookmarks yet.
			</span>
			<div>
				<CreateBookmarkButton
					className="block gap-2 px-2 py-2 mx-auto text-white border-transparent rounded-lg dark:bg-gray-500 dark:hover:bg-gray-600"
					showText
				/>
			</div>
		</div>
	);
};

export default NoDataWarning;
