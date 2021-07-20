import * as React from "react";
import {
	HiOutlineSortAscending,
	HiOutlineSortDescending,
} from "react-icons/hi";
import Popup from "~/components/Popup";
import useDisclosure from "~/hooks/use-disclosure";
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
			<ul className="flex flex-col space-y-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 mt-2">
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
		<li className="flex items-center justify-between space-x-4 whitespace-nowrap">
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
