import clsx from "clsx";
import * as React from "react";

type Props = JSX.IntrinsicElements["div"] & {
	className?: string;
	title: string;
	children?: React.ReactNode;
	"data-test"?: string;
};

const Badge = React.forwardRef<HTMLDivElement, Props>(
	(
		{
			className = "",
			title,
			children,
			"data-test": dataTest = "badge",
			...props
		},
		ref,
	) => {
		return (
			<div
				data-test={dataTest}
				ref={ref}
				className={clsx([
					"flex gap-1.5 px-2 py-1 text-xs font-medium dark:text-white items-center justify-center uppercase rounded-full",
					className,
				])}
				{...props}
			>
				{title}
				{children}
			</div>
		);
	},
);

Badge.displayName = "Badge";

export default Badge;
