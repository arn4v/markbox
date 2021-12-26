import * as React from "react";

export function mergeRefs<NodeType extends HTMLElement | null>(
	refs: Array<React.MutableRefObject<NodeType> | React.LegacyRef<NodeType>>,
): React.RefCallback<NodeType> {
	return (node: NodeType) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(node);
			} else if (ref != null) {
				(ref as React.MutableRefObject<NodeType | null>).current = node;
			}
		});
	};
}
