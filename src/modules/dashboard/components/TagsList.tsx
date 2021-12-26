import type { Tag as TagType } from "@prisma/client";
import * as React from "react";
import Input from "~/components/Input";
import useBreakpoints from "~/hooks/use-breakpoints";
import useFuse from "~/hooks/use-fuse";
import { trpc } from "~/lib/trpc";
import useDashboardStore from "../store";
import Tag from "./Tag";

export default function TagsList() {
	const {
		isEnabled,
		onDisable,
		tag: activeTag,
	} = useDashboardStore((state) => ({
		...state.edit_mode,
		tag: state.tag,
	}));
	const { data, isLoading } = trpc.useQuery(["tags.all"], {
		onSuccess(data) {
			if (data?.length === 0) {
				onDisable();
			}
		},
	});
	const [query, setQuery] = React.useState("");
	const { result } = useFuse({
		data: data?.sort((a, b) => a.name.localeCompare(b.name)) ?? [],
		query: query,
		options: {
			keys: ["name"],
		},
	});
	const { isLg } = useBreakpoints();
	const activeTagData = React.useMemo(() => {
		return data?.find((item) => item.name === activeTag) as TagType;
	}, [data, activeTag]);

	// Disable edit mode on mobile if it is enabled
	React.useEffect(() => {
		if (!isLg && isEnabled) onDisable();
	}, [isEnabled, isLg, onDisable]);

	return (
		<>
			<Input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="w-full px-2 py-2"
				placeholder="Search tags..."
				data-test="tag-search-input"
				showClear
				onClear={() => setQuery("")}
			/>
			<ul
				data-test="dashboard-tags-list"
				className="flex flex-col items-center justify-start w-full gap-4"
			>
				{result?.length === data?.length ? (
					<Tag
						isEditModeEnabled={false}
						isActive={activeTag === "All"}
						showPin={false}
					/>
				) : null}
				{activeTag !== "All" ? (
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
							if (item.name === activeTag) return null;
							return (
								<Tag
									key={item.id}
									data={item}
									isActive={item.name === activeTag}
									isEditModeEnabled={isEnabled}
								/>
							);
						})
				) : !isLoading && query.length > 0 ? (
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
