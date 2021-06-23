import clsx from "clsx";
import { Colors } from "~/types/Colors";

interface Props {
	className?: string;
	title: string;
	children?: React.ReactNode;
	color?: Colors;
	variant: "solid" | "outline";
}

export default function Badge({
	className = "",
	title,
	children,
	color = "gray-200",
	variant,
}: Props) {
	return (
		<div
			className={clsx([
				"flex gap-1.5 px-2 py-1 text-xs font-medium text-white items-center justify-center uppercase rounded-full",
				variant === "solid" && `bg-${color}`,
				variant === "outline" && ``,
				className,
			])}>
			{title}
			{children}
		</div>
	);
}
