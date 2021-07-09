import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { HiPlus } from "react-icons/hi";

interface Props {
	className?: string;
	onClick?(): void;
	showText?: boolean;
}

export default function CreateButton({
	className,
	onClick,
	showText = false,
}: Props): JSX.Element {
	const router = useRouter();

	return (
		<Link href="/create">
			<a
				className={clsx([
					"w-full font-medium items-center justify-center flex transition focus:outline-none lg:p-2 lg:rounded-lg lg:gap-2 border p-[1px] rounded-full border-gray-400 dark:border-gray-300 lg:w-auto lg:h-auto",
					showText
						? "bg-blue-600 hover:bg-blue-700 dark:hover:bg-gray-700 dark:bg-gray-800 border"
						: "lg:border-none",
					className,
				])}
			>
				<span className={!showText ? "hidden lg:block" : ""}>
					Create bookmark
				</span>
				<HiPlus className="w-5 h-5 fill-current" />
			</a>
		</Link>
	);
}
