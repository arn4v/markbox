import Fuse from "fuse.js";
import * as React from "react";

export default function useFuse<T extends unknown>({
	data,
	query = "",
	options = {},
}: {
	data: T[];
	query: string;
	options: Fuse.IFuseOptions<T>;
}) {
	const fuse = React.useMemo(() => {
		return new Fuse(data, options);
	}, [data, options]);

	const result = React.useMemo(() => {
		return query
			? fuse.search(query).map((item) => {
					return item.item;
			  })
			: data;
	}, [data, fuse, query]);

	return { fuse, result };
}
