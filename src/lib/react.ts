import * as React from "react";

export function mergeRefs<
	NodeType extends HTMLElement,
	OurRefType extends React.MutableRefObject<NodeType>,
	TheirRefType extends
		| React.MutableRefObject<NodeType>
		| ((node: NodeType) => unknown),
>(node: NodeType, ourRef: OurRefType, theirRef: TheirRefType) {
	ourRef.current = node;
	if (typeof theirRef === "function") {
		theirRef(node);
	} else if (theirRef) {
		theirRef.current = node;
	}
}
