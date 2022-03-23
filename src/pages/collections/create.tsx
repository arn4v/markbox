import { useRouter } from "next/router";
import * as React from "react";
import { HiX } from "react-icons/hi";
import Badge from "~/components/Badge";
import { Input }  from "~/components/Input";
import useFuse from "~/hooks/use-fuse";
import { AppLayout } from "~/components/AppLayout";
import { trpc } from "~/lib/trpc";
import CreateBookmarkButton from "~/modules/dashboard/components/CreateButton";
import { useMixpanel } from "~/providers/Mixpanel";

export default function CreateCollectionPage() {
	const mixpanel = useMixpanel();
	const router = useRouter();
	const { data } = trpc.useQuery(["tags.all"]);
	const { mutate } = trpc.useMutation("collections.create", {
		onSuccess(data) {
			mixpanel.track("Collection Created", {
				id: data?.id,
				name: data?.name,
				isPublic: data?.isPublic,
			});
			router.push("/collections");
		},
	});
	const [state, setState] = React.useState({
		name: "",
		isPublic: false,
		tagsConnect: {} as Record<string, { id: string; name: string }>,
	});
	const [search, setSearch] = React.useState("");
	const { result: tags } = useFuse({
		data: data?.filter((item) => !state.tagsConnect[item.name]) ?? [],
		query: search,
		options: {
			keys: ["name"],
		},
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		switch (e.target.name) {
			case "isPublic": {
				setState((prev) => ({
					...prev,
					[e.target.name]: e.target.value === "Yes" ? true : false,
				}));
				break;
			}
			case "name": {
				setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
				break;
			}
		}
	};

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		mutate({
			...state,
			tagsConnect: Object.values(state.tagsConnect).map((item) => item.id),
		});
	};

	return (
		<AppLayout data-test="create-bookmark-root">
			<div className="flex flex-col w-11/12 lg:p-6 dark:bg-gray-900 lg:w-1/2 mt-12 mx-auto">
				<div className="bg-gray-200 flex items-center px-4 py-4">
					<h1 className="whitespace-nowrap text-xl lg:text-2xl font-bold upper-case">
						Create Collection
					</h1>
				</div>
				<form
					data-test="create-collection-form"
					className="flex flex-col space-y-8 bg-gray-50 py-6 px-4"
					onSubmit={onSubmit}
				>
					<div className="w-full">
						<label htmlFor="title" className="block font-medium">
							Name
						</label>
						<Input
							name="name"
							type="text"
							className="block w-full h-10 mt-2"
							placeholder="Name"
							value={state.name}
							onChange={onChange}
							autoComplete="off"
							required
						/>
					</div>
					<div className="w-full">
						<p className="block font-medium">
							Do you want this collection to be public?
						</p>
						<div className="flex items-center space-x-4 mt-2">
							<input
								id="public"
								name="isPublic"
								type="radio"
								value="No"
								onChange={onChange}
								className="rounded-full appearance-none"
							/>
							<label htmlFor="public">Yes</label>
						</div>
						<div className="flex items-center space-x-4">
							<input
								id="private"
								name="isPublic"
								type="radio"
								value="No"
								onChange={onChange}
								className="rounded-full appearance-none"
							/>
							<label htmlFor="private">No</label>
						</div>
					</div>
					<div className="w-full">
						<p className="block font-bold">Tags</p>
						<div className="flex flex-wrap gap-2 mt-2">
							{Object.values(state.tagsConnect).length === 0 ? (
								<p>
									<i>No tags selected...</i>
								</p>
							) : (
								Object.values(state.tagsConnect).map((item) => {
									return (
										<Badge
											key={item.name}
											title={item?.name}
											className="z-50 dark:bg-gray-900 dark:border-gray-600 border border-gray-300 bg-white"
										>
											<button
												type="button"
												onClick={() => {
													setState((prev) => {
														const tagsConnect = prev.tagsConnect;
														delete prev.tagsConnect[item?.name];
														return {
															...prev,
															tagsConnect,
														};
													});
												}}
											>
												<HiX />
											</button>
										</Badge>
									);
								})
							)}
						</div>
						<div className="flex flex-col mt-4 rounded-md">
							<Input
								type="text"
								autoComplete="none"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full bg-white rounded-none"
								placeholder="Search tags..."
							/>
							<div className="max-h-[200px] overflow-y-scroll bg-gray-200">
								{data?.length === 0 ? (
									<div>
										<div
											data-test="dashboard-no-data-warning"
											className="flex flex-col items-center justify-center gap-8 py-8  dark:bg-gray-900 dark:text-white"
										>
											<span className="text-xl font-medium text-center">
												You don&apos;t have any tags or bookmarks yet. Create a
												bookmark & add tags to it before creating a collection.
											</span>
											<div>
												<CreateBookmarkButton
													className="block gap-2 px-2 py-2 mx-auto text-white border-transparent rounded-lg dark:bg-gray-500 dark:hover:bg-gray-600"
													showText
												/>
											</div>
										</div>
									</div>
								) : tags?.length > 0 ? (
									tags?.map((item) => (
										<div
											key={item?.id}
											className="flex items-center justify-between w-full px-4 py-2 border-b border-stone-300"
										>
											<p>{item?.name}</p>
											<button
												onClick={() =>
													setState((prev) => ({
														...prev,
														tagsConnect: {
															...prev.tagsConnect,
															[item?.name]: {
																name: item?.name,
																id: item?.id,
															},
														},
													}))
												}
												className="block"
											>
												Add
											</button>
										</div>
									))
								) : (
									<div className="p-4">
										<i>No tags found...</i>
									</div>
								)}
							</div>
						</div>
					</div>
					<button
						data-test="create-form-submit"
						type="submit"
						className="px-4 py-2 mt-4 ml-auto transition duration-100 bg-blue-600 font-bold text-white border border-gray-300 rounded-md dark:bg-gray-600 hover:bg-blue-700 focus:border-transparent dark:border-transparent dark:hover:bg-gray-500 focus:ring-2 ring-offset-current ring-offset-2 focus:outline-none"
					>
						Submit
					</button>
				</form>
			</div>
		</AppLayout>
	);
}
