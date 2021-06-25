import * as React from "react";

export function getTargetChildren(
	children: React.ReactNode | undefined,
	target: React.ElementType,
) {
	const withTarget: React.ReactElement<any, any>[] = [];
	const withoutTarget = React.Children.map(children, (item) => {
		if (!React.isValidElement(item)) return item;
		if (item.type === target) {
			withTarget.push(item);
			return null;
		}
		return item;
	});

	return [withTarget, withoutTarget];
}

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
