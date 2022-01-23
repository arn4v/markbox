import clsx from "clsx";
import * as React from "react";
import {
	HiOutlineSortAscending,
	HiOutlineSortDescending,
} from "react-icons/hi";
import { useDisclosure } from "react-sensible";
import Popup, { PopupProps } from "~/components/Popup";
import { useStore } from "~/store";
import type { SortBy } from "~/types";

const SortButton = ({
	children,
	className,
	placement = "bottom-start",
}: {
	children?: React.ReactNode;
	className?: string;
	placement?: PopupProps["placement"];
}) => {
	const sort = useStore((state) => state.sort.type);
	const { isOpen, onToggle, onClose } = useDisclosure();

	return (
		<Popup
			placement={placement}
			isOpen={isOpen}
			onDismiss={onClose}
			trigger={
				<button
					onClick={onToggle}
					className={clsx([
						"h-full border border-gray-200 rounded-lg px-4 shadow hover:shadow-md transition",
						children ? "flex items-center space-x-2" : "aspect-1",
						className,
					])}
				>
					{sort === "created_at_asc" || sort === "updated_at_asc" ? (
						<HiOutlineSortAscending className="h-5 w-5" />
					) : (
						<HiOutlineSortDescending className="h-5 w-5" />
					)}
					{children ? <span>{children}</span> : null}
				</button>
			}
		>
			<ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-2">
				<SortItem type="created_at_desc">Created at: Descending</SortItem>
				<SortItem type="created_at_asc">Created at: Ascending</SortItem>
				<SortItem type="updated_at_desc">Updated at: Descending</SortItem>
				<SortItem type="updated_at_asc">Updated at: Ascending</SortItem>
			</ul>
		</Popup>
	);
};

export interface SortItemProps {
	type: SortBy;
	children: React.ReactNode;
}

const SortItem = ({ type, children }: SortItemProps) => {
	const [sort, setSort] = useStore((state) => [
		state.sort.type,
		state.sort.actions.setSort,
	]);

	return (
		<li
			className={clsx(
				"flex items-center justify-between space-x-4 whitespace-nowrap dark:text-white py-2 px-4",
			)}
		>
			<span>{children}</span>
			<input
				type="radio"
				checked={sort === type}
				onChange={() => {
					setSort(type);
				}}
			/>
		</li>
	);
};

export default SortButton;
