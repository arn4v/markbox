import clsx from "clsx";
import { useRouter } from "next/router";
import * as React from "react";
import { useGetTagsQuery } from "~/graphql/types.generated";
import Tag from "./Tag";

export default function TagList() {
	const { data } = useGetTagsQuery({}, { initialData: { tags: [] } });
	const {
		query: { tag },
	} = useRouter();

	return (
		<div className="flex flex-col w-full items-center">
			<h2
				className={clsx([
					"text-gray-900 dark:text-gray-400 font-bold uppercase text-lg my-2 mr-auto",
				])}>
				Tags
			</h2>
			<div className="my-2 w-full flex flex-col items-center justify-start gap-2 pr-6">
				<Tag redirect={false} active={typeof tag === "undefined"}>
					All
				</Tag>
				{data?.tags?.map((item) => {
					return (
						<Tag key={item.id} active={tag === item.name.toLowerCase()}>
							{item.name}
						</Tag>
					);
				})}
			</div>
		</div>
	);
}
