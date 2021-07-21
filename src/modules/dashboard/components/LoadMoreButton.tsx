import * as React from "react";
import Spinner from "~/components/Spinner";
import { Bookmark } from "~/graphql/types.generated";

interface Props {
	/**
	 * @description Next page loading state
	 */
	isLoading: boolean;

	/**
	 * @description LoadMoreButton visibility
	 */
	isHidden: boolean;

	/**
	 * @description onClick handler
	 */
	onClick(): void;
}

const LoadMoreButton = React.forwardRef<HTMLDivElement, Props>(
	({ onClick, isHidden, isLoading }, ref) => {
		if (isHidden) return null;

		return (
			<div ref={ref} className="flex items-center justify-center lg:col-span-2">
				<button
					onClick={onClick}
					className="px-4 py-2 rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 transition bg-gray-100 hover:bg-gray-200 border border-gray-300 dark:border-transparent flex items-center justify-center w-32 h-10"
				>
					{isLoading ? (
						<Spinner className="text-black dark:text-white h-5 w-5 mr-0" />
					) : (
						"Load more"
					)}
				</button>
			</div>
		);
	},
);

LoadMoreButton.displayName = "LoadMoreButton";

export default LoadMoreButton;
