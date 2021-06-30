import * as React from "react";
import { HiOutlinePlus, HiPlus, HiPlusCircle } from "react-icons/hi";
import clsx from "clsx";
import { useRouter } from "next/router";
import QueryString from "qs";
import useStore from "./store";
import useBreakpoints from "~/hooks/use-breakpoints";
import { PlusIcon } from "@radix-ui/react-icons";

interface Props {
	className?: string;
	onClick?(): void;
}

export default function CreateBookmarkButton({
	className,
	onClick,
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
				"w-full text-white font-medium items-center justify-center flex transition duration-150 ease-in-out focus:outline-none",
				isLg
					? "px-2 py-2 rounded-lg gap-2"
					: "border rounded-full border-gray-200 h-[20px] w-[20px]",
				className
					? className
					: isLg
					? "hover:bg-blueGray-600 bg-blueGray-700"
					: "",
			])}
			aria-haspopup={true}
			aria-expanded={isOpen}
			onClick={onOpen}
		>
			<span className="hidden lg:block">Create bookmark</span>
			<PlusIcon className="w-4 h-4" />
		</button>
	);
}
