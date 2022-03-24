import clsx from "clsx";
import * as React from "react";

type Props = JSX.IntrinsicElements["div"] & {
	className?: string;
	title: string;
	children?: React.ReactNode;
	"data-test"?: string;
};

const Badge = React.forwardRef<HTMLDivElement, Props>(
	({ className = "", title, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				data-test="badge"
				{...props}
				className={clsx([
					"flex gap-1.5 px-1.5 py-0.5 text-xs font-medium dark:text-white items-center justify-center uppercase rounded-full",
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
