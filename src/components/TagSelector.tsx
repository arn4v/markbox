import { HiX } from "react-icons/hi";
import { InferQueryOutput } from "~/lib/trpc";
import CreateBookmarkButton from "~/modules/dashboard/components/CreateButton";
import Badge from "./Badge";
import { Input } from "./Input";

type Tag = NonNullable<InferQueryOutput<"tags.byId">>;
type TagArray = Tag[];

export function TagSelector({
	query,
	setQuery,
	selected,
	onSelect,
	onRemove,
	data,
}: {
	query: string;
	setQuery(query: string): void;
	selected: Record<
		string,
		{
			id: string;
			name: string;
			[key: string]: unknown;
		}
	>;
	data: TagArray;
	onSelect(selectedTag: {
		id: string;
		name: string;
		[key: string]: unknown;
	}): void;
	onRemove(removedTag: {
		id: string;
		name: string;
		[key: string]: unknown;
	}): void;
}) {
	return (
		<>
			<div className="flex flex-wrap gap-2 mt-2">
				{Object.values(selected).length === 0 ? (
					<p>
						<i>No tags selected...</i>
					</p>
				) : (
					Object.values(selected).map(({ id, name }) => {
						return (
							<Badge
								key={id}
								title={name}
								className="z-50 dark:bg-gray-900 dark:border-gray-600 border border-gray-300"
							>
								<button
									type="button"
									onClick={() => {
										onRemove({
											id,
											name,
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
					value={query}
					onChange={(e) => setQuery(e.target.value)}
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
					) : (
						data?.map((item) => (
							<div
								key={item?.id}
								className="flex items-center justify-between w-full px-4 py-2 border-b border-stone-300"
							>
								<p>{item?.name}</p>
								<button
									onClick={() =>
										onSelect({
											id: item?.id,
											name: item?.name,
										})
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
		</>
	);
}
