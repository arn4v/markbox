import * as React from "react";
import { useGetTagsQuery } from "~/graphql/types.generated";

export default function Tags() {
	const { data } = useGetTagsQuery();

	return (
		<>
			<div className="w-full h-px bg-gray-400 dark:hidden" />
			<h2 className="text-gray-900 dark:text-gray-400 font-bold uppercase text-lg my-2">
				Tags
			</h2>
			<div className="w-full h-px bg-gray-400 dark:hidden" />
			<div className="my-2 w-full flex flex-col gap-2">
				{data?.tags.map((item) => {
					return <div key={item.id}>{item.name}</div>;
				})}
			</div>
		</>
	);
}
