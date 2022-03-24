import clsx from "clsx";
import * as React from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";

export interface AlertProps extends React.ComponentProps<"div"> {
	size?: "sm" | "base" | "lg";
	theme?: "info" | "danger" | "warning";
	className?: string;
	children?: React.ReactNode;
}

export default function Alert({
	theme = "info",
	size = "base",
	className,
	children,
}: AlertProps): JSX.Element {
	return (
		<div
			className={clsx(
				`flex items-center justify-between rounded font-medium`,
				{
					"h-6 px-2.5 text-xs": size === "sm",
					"h-8 px-4 text-sm": size === "base",
					"h-10 px-5 text-base": size === "lg",
				},
				{
					"bg-blue-200 text-blue-900": theme === "info",
					"bg-red-200 text-red-900": theme === "danger",
					"bg-amber-200 text-amber-800": theme === "warning",
				},
				className,
			)}
		>
			<span className="h-auto flex items-center gap-2">
				<HiOutlineInformationCircle />
				{children}
			</span>
		</div>
	);
}
