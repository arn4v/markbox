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
