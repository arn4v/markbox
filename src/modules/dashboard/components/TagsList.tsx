import * as React from "react";
import Input from "~/components/Input";
import { Tag as TagType, useGetAllTagsQuery } from "~/graphql/types.generated";
import useBreakpoints from "~/hooks/use-breakpoints";
import useFuse from "~/hooks/use-fuse";
import useDashboardStore from "../store";
import Tag from "./Tag";

export default function TagsList() {
	const { isEnabled, onDisable, tag } = useDashboardStore((state) => ({
		...state.edit_mode,
		tag: state.tag,
	}));
	const { data } = useGetAllTagsQuery(
		{},
		{
			onSuccess(data) {
				if (data?.tags?.length === 0) {
					onDisable();
				}
			},
			initialData: { tags: [] },
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
			/>
			<ul className="flex flex-col items-center justify-start w-full gap-4">
				{result?.length === data?.tags?.length ? (
					<Tag
						isEditModeEnabled={false}
						data={{ id: undefined, name: "All" }}
						active={typeof tag === "undefined"}
					/>
				) : null}
				{result?.length > 0 ? (
					result?.map((item) => {
						return (
							<Tag
								key={item.id}
								data={item}
								active={tag === item.id}
								isEditModeEnabled={isEnabled}
							/>
						);
					})
				) : (
					<div className="bg-gray-100 dark:bg-gray-800 dark:border-gray-700 w-full p-6 flex items-center justify-center rounded border border-gray-300">
						Couldn't find any results for query {`"${search}"`}, try again.
					</div>
				)}
			</ul>
		</>
	);
}
