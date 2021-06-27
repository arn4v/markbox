import * as React from "react";

export default function useTargetChildren(
	children: React.ReactNode | undefined,
	target: React.ElementType,
) {
	const [withTarget, setWithTarget] = React.useState<React.ReactNode[]>([]);
	const [withoutTarget, setWithoutTarget] = React.useState<React.ReactNode[]>(
		[],
	);

	React.useEffect(() => {
		const _withTarget = [];
		const _withoutTarget = React.Children.toArray(children).filter((item) => {
			if (!React.isValidElement(item)) return true;
			if (item.type === target) {
				_withTarget.push(item);
				return false;
			}
			return true;
		});

		setWithTarget(_withTarget);
		setWithoutTarget(_withoutTarget);
	}, [children, target]);

	return [withTarget, withoutTarget];
}
