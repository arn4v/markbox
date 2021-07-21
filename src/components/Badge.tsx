import * as React from "react";
import clsx from "clsx";
import colors from "~/lib/colors";
import { Colors } from "~/types/Colors";

interface Props {
	className?: string;
	title: string;
	children?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, Props>(
	({ className = "", title, children }) => {
		return (
			<div
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
