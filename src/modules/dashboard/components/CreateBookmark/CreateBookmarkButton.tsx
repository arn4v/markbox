import clsx from "clsx";
import { useRouter } from "next/router";
import QueryString from "qs";
import * as React from "react";
import { HiPlus } from "react-icons/hi";
import useBreakpoints from "~/hooks/use-breakpoints";
import useStore from "./store";

interface Props {
	className?: string;
	onClick?(): void;
	showText?: boolean;
}

export default function CreateBookmarkButton({
	className,
	onClick,
	showText = false,
}: Props): JSX.Element {
	const { isOpen, onOpen: _onOpen } = useStore();
	const router = useRouter();
	const { isLg } = useBreakpoints();

	const onOpen = () => {
		_onOpen(() => {
			if (onClick) onClick();
			router.push(
				router.pathname + "?" + QueryString.stringify({ create: true }),
				null,
				{
					shallow: true,
				},
			);
		});
	};

	return (
		<button
			className={clsx([
				"w-full font-medium items-center justify-center flex transition duration-150 ease-in-out focus:outline-none lg:px-2 lg:py-2 lg:rounded-lg lg:gap-2 border p-[1px] rounded-full border-gray-400 dark:border-gray-300 lg:w-auto lg:h-auto",
				showText
					? "bg-blue-600 hover:bg-blue-700 dark:hover:bg-gray-700 dark:bg-gray-800 border"
					: "lg:border-none",
				className,
			])}
			aria-haspopup={true}
			aria-expanded={isOpen}
			onClick={onOpen}
		>
			<span className={!showText ? "hidden lg:block" : ""}>
				Create bookmark
			</span>
			<HiPlus className="w-5 h-5 fill-current" />
		</button>
	);
}
