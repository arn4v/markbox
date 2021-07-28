import { data } from "cheerio/lib/api/attributes";
import * as React from "react";
import { HiOutlineMenu, HiPencil, HiTrash } from "react-icons/hi";
import Popup from "~/components/Popup";

export default function BookmarkCardMenu({isOpen, onClose, onToggle}) {


	<Popup
		isOpen={isOpen}
		onDismiss={onClose}
		placement="bottom"
		trigger={
			<button
				onClick={onToggle}
				aria-expanded={isOpen}
				data-test="bookmark-menu-trigger"
				aria-haspopup={true}
				className="p-1 text-black transition rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-white hidden lg:block"
			>
				<HiOutlineMenu className="w-5 h-5 fill-current" />
			</button>
		}
	>
		<ul className="flex flex-col w-48 mt-1 overflow-hidden bg-gray-100 border border-gray-300 rounded-lg dark:border-none dark:bg-gray-600">
			<li className="w-full border-b border-gray-300 dark:border-blueGray-400">
				<button
					data-test="bookmark-menu-edit"
					onClick={() => {
						if (isLg) {
							onDrawerOpen();
						} else {
							router.push("/edit/" + data?.id);
						}

						onDropdownClose();
					}}
					className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-gray-500 focus:outline-none hover:bg-gray-300"
				>
					Edit <HiPencil />
				</button>
			</li>
			<li className="w-full">
				<button
					data-test="bookmark-menu-delete"
					className="flex items-center justify-center w-full gap-2 py-2 transition dark:hover:bg-gray-500 focus:outline-none hover:bg-gray-300"
					onClick={() => {
						onDeleteOpen();
						onDropdownClose();
					}}
				>
					Delete <HiTrash />
				</button>
			</li>
		</ul>
	</Popup>;
}
