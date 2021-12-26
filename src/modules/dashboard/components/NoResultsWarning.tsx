export default function NoResultsWarning({
	isVisible,
}: {
	isVisible: boolean;
}) {
	if (!isVisible) return null;

	return (
		<div className="flex flex-col items-center justify-center gap-8 py-8 bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-white">
			<span className="text-lg font-medium text-center">
				Couldn&apos;t find any bookmarks with that query.
			</span>
		</div>
	);
}
