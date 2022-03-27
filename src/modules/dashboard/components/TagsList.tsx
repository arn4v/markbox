import type { Tag as TagType } from "@prisma/client";
import { useRouter } from "next/router";
import * as React from "react";
import { Input } from "~/components/Input";
import useBreakpoints from "~/hooks/use-breakpoints";
import useFuse from "~/hooks/use-fuse";
import { trpc } from "~/lib/trpc";
import { useStore } from "~/store";
import Tag from "./Tag";

export default function TagsList() {
	const { query, asPath } = useRouter();
	const [isEnabled, onDisable] = useStore((state) => [
		state.editMode.isEnabled,
		state.editMode.actions.onDisable,
	]);
	const { data, isLoading } = trpc.useQuery(["tags.all"], {
		onSuccess(data) {
			if (data?.length === 0) {
				onDisable();
			}
		},
	});
	const [search, setSearch] = React.useState("");
	const { result } = useFuse({
		data: data?.sort((a, b) => a.name.localeCompare(b.name)) ?? [],
		query: search,
		options: {
			keys: ["name"],
		},
	});
	const { isLg } = useBreakpoints();
	const activeTagData = React.useMemo(() => {
		return data?.find((item) => item.name === query?.tag) as TagType;
	}, [data, query?.tag]);

	// Disable edit mode on mobile if it is enabled
	React.useEffect(() => {
		if (!isLg && isEnabled) onDisable();
	}, [isEnabled, isLg, onDisable]);

	return (
		<>
			<Input
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="w-full px-2 py-2"
				placeholder="Search tags..."
				data-test="tag-search-input"
				showClear
				onClear={() => setSearch("")}
			/>
			<ul
				data-test="dashboard-tags-list"
				className="flex flex-col items-center justify-start w-full gap-4"
			>
				{result?.length === data?.length ? (
					<Tag
						isEditModeEnabled={false}
						isActive={!!!query?.tag}
						showPin={false}
					/>
				) : null}
				{typeof query?.tag === "string" ? (
					<Tag
						isEditModeEnabled={isEnabled}
						data={activeTagData}
						isActive={true}
					/>
				) : null}
				{result?.length > 0 ? (
					result
						.sort((a, b) => {
							if (a.isPinned && !b.isPinned) return -1;
							return 0;
						})
						.map((item) => {
							if (item.name === query?.tag) return null;
							return (
								<Tag
									key={item.id}
									data={item}
									isActive={item.name === query?.tag}
									isEditModeEnabled={isEnabled}
								/>
							);
						})
				) : !isLoading && search.length > 0 ? (
					<div
						data-test="no-tags-search-warning"
						className="bg-gray-100 dark:bg-gray-800 dark:border-gray-700 w-full p-6 flex items-center justify-center rounded"
					>
						Couldn&apos;t find any results for query {`"${query}"`}, try again.
					</div>
				) : null}
			</ul>
		</>
	);
}
