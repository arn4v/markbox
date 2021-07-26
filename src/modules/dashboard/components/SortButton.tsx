import clsx from "clsx";
import * as React from "react";
import {
	HiOutlineSortAscending,
	HiOutlineSortDescending
} from "react-icons/hi";
import { useDisclosure } from "react-sensible";
import Popup from "~/components/Popup";
import useDashboardStore from "../store";
import { SortBy } from "../types";

const SortButton = () => {
	const { sort } = useDashboardStore();
	const { isOpen, onToggle, onClose } = useDisclosure();

	return (
		<Popup
			placement="bottom-start"
			isOpen={isOpen}
			onDismiss={onClose}
			trigger={
				<button
					onClick={onToggle}
					className="h-10 w-10 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-800 flex items-center justify-center rounded-lg backdrop-blur-xl hover:bg-gray-200 transition shadow-sm"
				>
					{sort === "created_at_asc" || sort === "updated_at_asc" ? (
						<HiOutlineSortAscending className="h-5 w-5" />
					) : (
						<HiOutlineSortDescending className="h-5 w-5" />
					)}
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
	const { setSort, sort } = useDashboardStore();

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
