import { DrawingPinFilledIcon, DrawingPinIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useDisclosure } from "react-sensible";
import { InferQueryOutput, trpc } from "~/lib/trpc";
import DeleteTagPopup from "./DeleteTag";
import EditTagPopup from "./EditTag";

interface TagProps {
	data?: NonNullable<InferQueryOutput<"tags.byId">>;
	isActive: boolean;
	isEditModeEnabled?: boolean;
	showPin?: boolean;
}

export default function Tag({
	isEditModeEnabled = false,
	data,
	showPin = true,
}: TagProps) {
	const {
		isOpen: isDeleteOpen,
		onClose: onDeleteClose,
		onOpen: onDeleteOpen,
	} = useDisclosure();
	const {
		isOpen: isEditOpen,
		onClose: onEditClose,
		onOpen: onEditOpen,
	} = useDisclosure();
	const trpcCtx = trpc.useContext();
	const router = useRouter();
	const { mutate: pinTag } = trpc.useMutation("tags.pin", {
		onSuccess() {
			trpcCtx.invalidateQueries(["tags.all"]);
		},
	});
	const isActive = React.useMemo(() => {
		if (!data) return false;

		return router?.query?.tag
			? Array.isArray(router?.query?.tag)
				? router?.query?.tag.includes(data?.name)
				: router.query?.tag === data?.name
			: false;
	}, [data, router.query?.tag]);

	if (!data) {
		return (
			<li
				data-test="dashboard-tag"
				className={clsx(["flex w-full gap-4 items-center"])}
			>
				<Link href="/app">
					<a
						className={clsx([
							"px-4 py-2 flex-grow transition rounded-md dark:text-white border flex items-center justify-between",
							isDeleteOpen && "z-30",
							typeof router.query?.tag === "undefined"
								? "dark:bg-gray-500 lg:dark:bg-gray-800 lg:dark:border-gray-700 bg-gray-200 border-gray-300 dark:border-gray-400 font-medium"
								: "lg:dark:bg-gray-900 lg:dark:hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 bg-gray-100 hover:bg-gray-200 border-transparent",
						])}
					>
						<span>All</span>
					</a>
				</Link>
			</li>
		);
	}
	return (
		<li
			data-test="dashboard-tag"
			className={clsx(["flex w-full gap-4 items-center"])}
		>
			<button
				onClick={(e) => {
					if (e.shiftKey) e.preventDefault();

					let tags = [
						...(e.shiftKey && Array.isArray(router.query?.tag)
							? router.query?.tag
							: [router.query?.tag]),
					];

					if (e.shiftKey && tags.includes(data?.name)) {
						tags = tags.filter((item) => item !== data?.name);
					} else {
						tags.push(data.name);
					}

					console.log(tags);

					router.push({
						href: "/app",
						query: {
							...router.query,
							tag: tags.filter((item) => typeof item === "string"),
						},
					});
				}}
				className={clsx([
					"px-4 py-2 flex-grow transition rounded-md dark:text-white border flex items-center justify-between",
					isDeleteOpen && "z-30",
					isActive
						? "dark:bg-gray-500 lg:dark:bg-gray-800 lg:dark:border-gray-700 bg-gray-200 border-gray-300 dark:border-gray-400 font-medium"
						: "lg:dark:bg-gray-900 lg:dark:hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 bg-gray-100 hover:bg-gray-200 border-transparent",
				])}
			>
				<span>{data?.name}</span>
				<button
					hidden={!showPin}
					onClick={(e) => {
						e.stopPropagation();
						pinTag({ id: data?.id as string, isPinned: !data?.isPinned });
					}}
				>
					{data?.isPinned ? (
						<DrawingPinFilledIcon className="h-5 w-5" />
					) : (
						<DrawingPinIcon className="h-5 w-5" />
					)}
				</button>
			</button>

			{isEditModeEnabled && (
				<div className="flex items-center gap-4">
					<EditTagPopup
						data={data}
						isOpen={isEditOpen}
						onClose={onEditClose}
						onOpen={onEditOpen}
					/>
					<DeleteTagPopup
						data={data}
						isOpen={isDeleteOpen}
						onClose={onDeleteClose}
						onOpen={onDeleteOpen}
					/>
				</div>
			)}
		</li>
	);
}
