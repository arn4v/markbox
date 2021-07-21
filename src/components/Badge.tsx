import clsx from "clsx";
import * as React from "react";

interface Props {
	className?: string;
	title: string;
	children?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, Props>(
	({ className = "", title, children }, ref) => {
		return (
			<div
				ref={ref}
				className={clsx([
					"flex gap-1.5 px-2 py-1 text-xs font-medium dark:text-white items-center justify-center uppercase rounded-full",
					className,
				])}
			>
				{title}
				{children}
			</div>
		);
	},
);

Badge.displayName = "Badge";

export default Badge;
