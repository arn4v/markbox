import clsx from "clsx";
import * as React from "react";
import { mergeRefs } from "~/lib/react";
import Spinner from "../Spinner";

export type ButtonProps = JSX.IntrinsicElements["button"] & {
	variant?: "solid" | "outline" | "ghost" | "unstyled";
	theme?:
		| "primary"
		| "secondary"
		| "success"
		| "danger"
		| "warning"
		| "unstyled";
	scale?: "sm" | "base" | "lg";
	isLoading?: boolean;
	loader?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className = "",
			variant = "solid",
			theme = "primary",
			isLoading = false,
			disabled,
			loader = <Spinner className="h-4 w-4" />,
			scale = "base",
			...props
		},
		ref: React.Ref<HTMLButtonElement>,
	) => {
		const internalRef: React.MutableRefObject<HTMLButtonElement | null> =
			React.useRef(null);

		return (
			<button
				{...props}
				ref={mergeRefs([internalRef, ref])}
				className={clsx(
					[
						"min-w-[max-content] font-medium transition relative focus:outline-none rounded focus:ring-[3px] active:scale-95",
						className,
					],
					variant === "solid"
						? {
								"bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-3 focus:ring-indigo-400":
									theme === "primary",
								"bg-red-600 text-white hover:bg-red-500 focus:ring-3 focus:ring-red-400":
									theme === "danger",
								"bg-amber-600 text-white hover:bg-amber-500 focus:ring-3 focus:ring-amber-400":
									theme === "warning",
						  }
						: "",
					variant === "outline"
						? {
								"border-2 border-indigo-600 hover:bg-indigo-200 focus:ring-3 focus:ring-indigo-500":
									theme === "primary",
								"border-2 border-slate-600 hover:bg-slate-200 focus:ring-3 focus:ring-slate-400":
									theme === "secondary",
								"border-2 border-red-600 hover:bg-red-200 focus:ring-2 focus:ring-red-400":
									theme === "danger",
								"border-2 border-amber-600 hover:bg-amber-200":
									theme === "warning",
						  }
						: "",
					variant === "ghost"
						? {
								"hover:bg-indigo-200 focus:ring-3 focus:ring-indigo-400":
									theme === "primary",
								"hover:bg-slate-200 focus:ring-3 focus:ring-slate-400":
									theme === "secondary",
								"hover:bg-red-200 text-red-900": theme === "danger",
								"hover:bg-red-200 text-amber-900": theme === "warning",
						  }
						: "",
					{
						"text-xs px-1.5 h-6": scale === "sm",
						"text-sm px-2 h-8": scale === "base",
						"text-base px-4 h-10": scale === "lg",
					},
				)}
				disabled={disabled || isLoading}
			>
				{isLoading ? (
					<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
						{loader}
					</span>
				) : null}
				<span className={clsx(isLoading ? "invisible" : "")}>
					{props.children}
				</span>
			</button>
		);
	},
);

Button.displayName = "Button";
