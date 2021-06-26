import Link from "next/link";
import * as React from "react";
import { useGetTagsQuery } from "~/graphql/types.generated";

export default function Tags() {
	const { data } = useGetTagsQuery({}, { initialData: { tags: [] } });

	return (
		<div className="flex flex-col w-full items-center">
			<h2 className="text-gray-900 dark:text-gray-400 font-bold uppercase text-lg my-2 mr-auto">
				Tags
			</h2>
			<div className="my-2 w-full flex flex-col items-center justify-start gap-2 pr-6">
				<Link href="/dashboard">
					<a className="px-4 py-2 w-full bg-blueGray-700 hover:bg-blueGray-600 transition rounded-md">
						All
					</a>
				</Link>
				{data?.tags?.map((item) => {
					return <div key={item.id}>{item.name}</div>;
				})}
			</div>
		</div>
	);
}
