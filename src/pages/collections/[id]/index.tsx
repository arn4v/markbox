import { useRouter } from "next/router";
import { HiPencil, HiTrash } from "react-icons/hi";
import { useDisclosure } from "react-sensible";
import { AppLayout } from "~/components/AppLayout";
import Badge from "~/components/Badge";
import { CopyCode } from "~/components/CopyCode";
import Modal from "~/components/Modal";
import { getDeploymentUrl } from "~/lib/misc";
import { trpc } from "~/lib/trpc";
import SortButton from "~/modules/dashboard/components/SortButton";
import { useMixpanel } from "~/providers/Mixpanel";
import { useStore } from "~/store";

export default function PrivateCollectionPage() {
	const router = useRouter();
	const id = router.query?.id as string;
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { invalidateQueries } = trpc.useContext();
	const mixpanel = useMixpanel();
	const { mutate } = trpc.useMutation("collections.delete", {
		onSuccess(data) {
			mixpanel.track("Collection Deleted", {
				id: data?.id,
			});
			invalidateQueries(["collections.all"]);
			router.push("/collections");
		},
	});
	const { data, isLoading } = trpc.useQuery(["collections.byId", id]);
	const sort = useStore((state) => state.sort.type);
	const { data: bookmarks, isLoading: isBookmarksLoading } = trpc.useQuery([
		"collections.bookmarks",
		{ id, sort },
	]);

	return (
		<>
			<AppLayout>
				<div className="flex flex-col space-y-8 mt-8 px-6 2xl:px-0">
					{/* Query is finished loading & collections exist */}
					{!isLoading && data ? (
						<div className="bg-white shadow overflow-hidden sm:rounded-lg">
							<div className="flex w-full items-center justify-between px-4 py-5 sm:px-6">
								<div className="">
									<h3 className="text-lg leading-6 font-bold text-gray-900">
										Collection
									</h3>
									<p className="mt-1 max-w-2xl text-sm text-gray-500">
										Personal details and application.
									</p>
								</div>
								<div className="flex space-x-4 items-center">
									<button
										onClick={() => router.push(`/collections/${id}/edit`)}
									>
										<HiPencil />
									</button>
									<button onClick={onOpen}>
										<HiTrash />
									</button>
								</div>
							</div>
							<div className="border-t border-gray-200">
								<dl>
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500">Name</dt>
										<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
											{data?.name}
										</dd>
									</div>
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500">
											Is Public?
										</dt>
										<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
											{data?.isPublic ? "Yes" : "No"}
										</dd>
									</div>
									{data?.isPublic ? (
										<>
											<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
												<dt className="text-sm font-medium text-gray-500">
													Shareable URL
												</dt>
												<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
													<a
														href={`${getDeploymentUrl()}/share/${id}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-cyan-600 underline hover:text-cyan-700"
													>{`${getDeploymentUrl()}/share/${id}`}</a>
												</dd>
											</div>
											<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
												<dt className="text-sm font-medium text-gray-500">
													Embed Code
												</dt>
												<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
													<CopyCode
														value={`<iframe src="${getDeploymentUrl()}/share/${id}" frameborder="0" allowfullscreen></iframe>`}
													/>
												</dd>
											</div>
											<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
												<dt className="text-sm font-medium text-gray-500">
													Views
												</dt>
												<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
													{data?.views.toString()}
												</dd>
											</div>
										</>
									) : null}
									<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500">Tags</dt>
										<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-wrap space-x-2">
											{data?.tags?.map((item) => (
												<Badge
													key={item?.id}
													title={item?.name}
													className="z-50 dark:bg-gray-900 dark:border-gray-600 border border-gray-300 bg-white"
												/>
											))}
										</dd>
									</div>
								</dl>
							</div>
						</div>
					) : null}

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
					{!isLoading && !isBookmarksLoading && data && bookmarks ? (
						<>
							<hr />
							<div>
								<span className="w-full flex items-center justify-between">
									<h1 className="text-lg font-bold">Bookmarks</h1>
									<SortButton />
								</span>
								<ol className="mt-8 list-decimal px-6">
									{bookmarks?.map((item) => {
										return (
											<li key={item?.id} className="mb-1">
												<a
													target="_blank"
													rel="noopener noreferrer"
													href={item?.url}
													className="text-cyan-600 underline hover:text-cyan-700"
												>
													{item?.title}
												</a>
											</li>
										);
									})}
								</ol>
							</div>
						</>
					) : null}
				</div>
			</AppLayout>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				overlayProps={{ className: "bg-black/[0.75] z-[60]" }}
			>
				<div className="flex flex-col gap-8 p-8 bg-white border border-gray-300 rounded-lg dark:border-none dark:bg-gray-900">
					<div className="text-center whitespace-no-wrap font-medium">
						Do you really want to delete this collection?
					</div>
					<div className="flex items-center justify-between w-full">
						<button
							type="button"
							className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition rounded"
							onClick={onClose}
						>
							Dismiss
						</button>
						<button
							type="button"
							className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-white transition"
							onClick={() => {
								mutate(id);
							}}
						>
							Delete
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
