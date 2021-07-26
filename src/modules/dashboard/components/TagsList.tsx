import * as React from "react";
import Input from "~/components/Input";
import { Tag as TagType, useGetAllTagsQuery } from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import useFuse from "~/hooks/use-fuse";
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
	const { data, isLoading } = useGetAllTagsQuery(
		{},
		{
			onSuccess(data) {
				if (data?.tags?.length === 0) {
					onDisable();
				}
			},
		},
	);
	const [search, setSearch] = React.useState("");
	const { result } = useFuse<TagType>({
		data: data?.tags?.sort((a, b) => a.name.localeCompare(b.name)),
		query: search,
		options: {
			keys: ["name"],
		},
	});
	const { isLg } = useBreakpoints();
	const activeTagData = React.useMemo(() => {
		return data?.tags.find((item) => item.name === activeTag);
	}, [data?.tags, activeTag]);

	// Disable edit mode on mobile if it is enabled
	React.useEffect(() => {
		if (!isLg && isEnabled) onDisable();
	}, [isEnabled, isLg, onDisable]);

	return (
		<>
			<Input
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="mb-2 w-full px-2 py-2"
				placeholder="Search tags..."
				data-test="tag-search-input"
			/>
			<ul
				data-test="dashboard-tags-list"
				className="flex flex-col items-center justify-start w-full gap-4"
			>
				{result?.length === data?.tags?.length ? (
					<Tag
						isEditModeEnabled={false}
						data={{ id: undefined, name: "All" }}
						isActive={activeTag === "All"}
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
					result.map((item) => {
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
				) : !isLoading && search.length > 0 ? (
					<div
						data-test="no-tags-search-warning"
						className="bg-gray-100 dark:bg-gray-800 dark:border-gray-700 w-full p-6 flex items-center justify-center rounded"
					>
						Couldn&apos;t find any results for query {`"${search}"`}, try again.
					</div>
				) : null}
			</ul>
		</>
	);
}
