import * as React from "react";
import Button from "~/components/Button";
import Spinner from "~/components/Spinner";

interface Props {
	/**
	 * @description Next page loading state
	 */
	isLoading: boolean;

	/**
	 * @description onClick handler
	 */
	onClick(): void;
}

const LoadMoreButton = React.forwardRef<HTMLDivElement, Props>(
	({ onClick, isLoading }, ref) => {
		return (
			<div
				data-test="bookmarks-load-more"
				ref={ref}
				className="flex items-center justify-center lg:col-span-2"
			>
				<Button
					onClick={onClick}
					className="px-4 py-2 rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 transition bg-gray-100 hover:bg-gray-200 border border-gray-300 dark:border-transparent flex items-center justify-center w-32 h-10"
					variant="unstyled"
					isLoading={isLoading}
					loader={
						<Spinner className="text-black dark:text-white h-5 w-5 mr-0" />
					}
				>
					Load more
				</Button>
			</div>
		);
	},
);

LoadMoreButton.displayName = "LoadMoreButton";

export default LoadMoreButton;
