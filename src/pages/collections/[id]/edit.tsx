import { useRouter } from "next/router";
import * as React from "react";
import { HiX } from "react-icons/hi";
import Badge from "~/components/Badge";
import Input from "~/components/Input";
import useFuse from "~/hooks/use-fuse";
import { AppLayout } from "~/layouts/App";
import { InferQueryOutput, trpc } from "~/lib/trpc";
import CreateBookmarkButton from "~/modules/dashboard/components/CreateButton";

export default function EditBookmarkPage() {
	const router = useRouter();
	const id = router.query.id as string;
	const { data: tagsData } = trpc.useQuery(["tags.all"]);
	const { mutate } = trpc.useMutation("collections.update", {
		onSuccess() {
			router.push(`/collections/${id}`);
		},
	});
	const [state, setState] = React.useState({
		name: "",
		isPublic: null,
		tags: {},
	} as {
		name: string;
		isPublic: string | null;
		tags: Record<string, string | null>;
	});
	const [search, setSearch] = React.useState("");
	const { result: tags } = useFuse({
		data: tagsData?.filter((item) => !state.tags[item.name]) ?? [],
		query: search,
		options: {
			keys: ["name"],
		},
	});

	const { data: collection } = trpc.useQuery(["collections.byId", id], {
		onSuccess(data) {
			setState({
				name: data?.name,
				isPublic: data?.isPublic === true ? "Yes" : "No",
				tags: data?.tags.reduce((acc, cur) => {
					acc[cur?.name] = cur?.id;
					return acc;
				}, {} as Record<string, string | null>),
			});
		},
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const tagsDisconnect: { id: string; name: string }[] = [];

		for (const tag of (collection as InferQueryOutput<"collections.byId">)
			?.tags) {
			if (!state?.tags[tag?.name])
				tagsDisconnect.push({ name: tag?.name, id: tag?.id });
		}

		const tagsConnect: string[] = [];

		for (const tagName of Object.keys(state.tags)) {
			if (
				!collection?.tags?.find((tag) => tag.name === tagName) &&
				!tagsDisconnect?.find((tag) => tag.name === tagName)
			) {
				const doesTagExist = tagsData?.find((tag) => tag?.name === tagName);
				if (doesTagExist) tagsConnect.push(doesTagExist?.id);
			}
		}

		mutate({
			id,
			name: state?.name,
			isPublic: state?.isPublic === "Yes",
			tagsConnect,
			tagsDisconnect: tagsDisconnect.map((item) => item.id),
		});
	};

	return (
		<AppLayout>
			<div className="flex flex-col w-11/12 lg:p-6 dark:bg-gray-900 lg:w-1/2 mt-12 mx-auto">
				<div className="bg-gray-200 flex items-center px-4 py-4">
					<h1 className="whitespace-nowrap text-xl lg:text-2xl font-bold upper-case">
						Edit Collection
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
								value="Yes"
								checked={state?.isPublic === "Yes"}
								onChange={onChange}
								className="rounded-full appearance-none"
							/>
							<label htmlFor="public">Yes</label>
						</div>
						<div className="flex items-center space-x-4">
							<input
								id="private"
								name="isPublic"
								checked={state?.isPublic === "No"}
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
							{Object.values(state.tags).length === 0 ? (
								<p>
									<i>No tags selected...</i>
								</p>
							) : (
								Object.keys(state.tags).map((item) => {
									return (
										<Badge
											key={item}
											title={item}
											className="z-50 dark:bg-gray-900 dark:border-gray-600 border border-gray-300"
										>
											<button
												type="button"
												onClick={() => {
													setState((prev) => {
														const tags = prev.tags;
														delete tags[item];

														return {
															...prev,
															tags,
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
								{tagsData?.length === 0 ? (
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
								) : (
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
														tags: {
															...prev.tags,
															[item?.name]: item?.id,
														},
													}))
												}
												className="block"
											>
												Add
											</button>
										</div>
									))
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
