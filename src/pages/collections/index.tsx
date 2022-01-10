import Avatar from "boring-avatars";
import clsx from "clsx";
import Link from "next/link";
import { HiPlus } from "react-icons/hi";
import Badge from "~/components/Badge";
import { AppLayout } from "~/layouts/App";
import { trpc } from "~/lib/trpc";

export default function CollectionsPage() {
	const { data, isLoading } = trpc.useQuery([
		"collections.all",
		{ sort: "created_at_asc" },
	]);

	return (
		<AppLayout>
			<div className="flex items-center w-full justify-between mt-8">
				<h1 className="font-bold text-2xl">Collections</h1>
				<Link href="/collections/create" passHref>
					<a
						className={clsx([
							"w-full font-medium items-center justify-center flex transition focus:outline-none lg:p-2 lg:rounded-lg lg:gap-2 rounded-full dark:border-gray-300 lg:w-auto lg:h-auto bg-blue-600 hover:bg-blue-700 dark:hover:bg-gray-700 dark:bg-gray-800 border text-white",
						])}
					>
						Create Collection <HiPlus />
					</a>
				</Link>
			</div>
			<div className="gap-8 grid grid-cols-4 mt-8">
				{/* Query is finished loading & collections exist */}
				{!isLoading && data && data?.length > 0
					? data?.map((coll) => (
							<Link key={coll?.id} href={`/collections/${coll.id}`} passHref>
								<a className="flex flex-col items-center justify-center space-y-4 bg-white shadow hover:shadow-lg border border-gray-100 transition-all p-8 rounded-lg">
									<Avatar name={coll?.id} variant="marble" size={48} />
									<span className="text-lg font-bold uppercase">
										{coll?.name}
									</span>
									<span className="flex flex-wrap gap-2 items-center justify-center">
										{coll?.tags?.map((item) => (
											<Badge
												key={item.name}
												title={item?.name}
												className="z-50 dark:bg-gray-900 dark:border-gray-600 border border-gray-300 bg-white"
											/>
										))}
									</span>
								</a>
							</Link>
					  ))
					: null}
				{/* Query is finished loading & collections don't exist */}
				{!isLoading && data?.length === 0 ? <></> : null}
				{/* Query is loading */}
				{isLoading
					? Array.from(Array(5).keys()).map((item, idx) => (
							<div
								key={idx}
								className="flex flex-col items-center justify-center space-y-4 bg-white shadow hover:shadow-lg border border-gray-100 transition-all p-8 rounded-lg"
							>
								<div className="w-[48px] h-[48px] bg-gray-200 animate-pulse rounded-full" />
								<span className="text-lg font-bold uppercase bg-gray-200 text-gray-200 animate-pulse select-none">
									Loading...
								</span>
								<span className="flex flex-wrap gap-2">
									{["test", "test", "test"].map((item, idx) => (
										<Badge
											key={idx}
											title={item}
											className="z-50 border text-gray-200 bg-gray-200 animate-pulse select-none"
										/>
									))}
								</span>
							</div>
					  ))
					: null}
			</div>
		</AppLayout>
	);
}
