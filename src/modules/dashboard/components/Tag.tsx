import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiChevronDown, HiPencil, HiTrash } from "react-icons/hi";
import Popup from "~/components/Popup";
import { useDeleteTagMutation } from "~/graphql/types.generated";
import useDisclosure from "~/hooks/use-disclosure";

interface TagProps {
	children: string;
	redirect?: boolean;
	active: boolean;
	showDropdown?: boolean;
	id: string;
}

export default function Tag({
	children,
	redirect = true,
	active,
	id,
	showDropdown = true,
}: TagProps) {
	const { isOpen, onClose, onToggle } = useDisclosure();
	const { mutate } = useDeleteTagMutation();

	return (
		<li className="flex w-full gap-4 items-center">
			<Link
				href={{
					href: "/dashboard",
					query: redirect
						? {
								tag: encodeURIComponent(children.toLowerCase()),
						  }
						: {},
				}}
				shallow={true}>
				<a
					className={clsx([
						"px-4 py-2 flex-grow transition rounded-md",
						active
							? "bg-blueGray-600"
							: "bg-blueGray-700 hover:bg-blueGray-600",
					])}>
					{children}
				</a>
			</Link>
			{showDropdown && (
				<Popup
					onDismiss={onClose}
					isOpen={isOpen}
					trigger={
						<button className="focus:outline-none" onClick={onToggle}>
							<HiChevronDown />
						</button>
					}>
					<ul className="w-48 dark:bg-blueGray-600 overflow-hidden rounded-lg mt-1 flex flex-col">
						<li className="w-full border-b border-blueGray-400">
							<button
								className="py-2 dark:hover:bg-blueGray-500 flex transition gap-2 items-center w-full justify-center focus:outline-none"
								onClick={() => {}}>
								Rename <HiPencil />
							</button>
						</li>
						<li className="w-full">
							<button
								className="py-2 dark:hover:bg-blueGray-500 flex transition gap-2 items-center w-full justify-center focus:outline-none"
								onClick={() => {
									mutate({ id });
									onClose();
								}}>
								Delete <HiTrash />
							</button>
						</li>
					</ul>
				</Popup>
			)}
		</li>
	);
}
