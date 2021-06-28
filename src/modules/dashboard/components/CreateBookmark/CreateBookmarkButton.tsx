import * as React from "react";
import { HiPlus, HiX } from "react-icons/hi";
import useDisclosure from "~/hooks/use-disclosure";
import Drawer, { DrawerContent } from "~/components/Drawer";
import {
	useCreateBookmarkMutation,
	useGetAllTagsQuery,
} from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import clsx from "clsx";
import { useQueryClient } from "react-query";
import Badge from "~/components/Badge";
import { useRouter } from "next/router";
import QueryString from "qs";
import useStore from "./store";

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
				"w-full text-white font-medium items-center justify-center hover:bg-blueGray-600 flex px-2 py-2 transition duration-150 ease-in-out bg-blueGray-700 rounded-lg gap-2 focus:outline-none",
				className,
			])}
			aria-haspopup={true}
			aria-expanded={isOpen}
			onClick={onOpen}>
			Create bookmark
			<HiPlus className="h-5 w-5" />
		</button>
	);
}
