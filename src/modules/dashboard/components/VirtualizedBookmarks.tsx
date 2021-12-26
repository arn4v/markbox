import * as React from "react";
import { useVirtual } from "react-virtual";
import { inferQueryOutput } from "~/lib/trpc";
import BookmarkCard from "./BookmarkCard";

interface Props {
	data: inferQueryOutput<"bookmarks.all">["data"];
}

const VirtualizedBookmarks: Component<Props> = ({ data }) => {
	const parentRef = React.useRef<HTMLDivElement>(null);
	const virtualized = useVirtual({
		parentRef,
		size: data?.length,
		estimateSize: React.useCallback(() => 35, []),
		overscan: 10,
	});

	return (
		<div ref={parentRef}>
			<div
				className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6"
				style={{
					height: `${virtualized.totalSize}px`,
				}}
			>
				{virtualized.virtualItems.map(({ index }) => (
					<BookmarkCard key={data[index].id} data={data[index]} />
				))}
			</div>
		</div>
	);
};

export default VirtualizedBookmarks;
