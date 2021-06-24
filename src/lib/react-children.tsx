import * as React from "react";

export function getTargetChildren(
	children: React.ReactNode | undefined,
	target: React.ElementType,
) {
	const withTarget: React.ReactElement<any, any>[] = [];
	const withoutTarget = React.Children.toArray(children).filter((item) => {
		if (!React.isValidElement(item)) return true;
		if (item.type === target) {
			withTarget.push(item);
			return false;
		}
		return true;
	});

	return [withTarget, withoutTarget];
}
