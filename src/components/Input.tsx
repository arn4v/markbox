import clsx from "clsx";
import * as React from "react";
import { HiX } from "react-icons/hi";
import { mergeRefs } from "~/lib/react";

export type InputProps = React.PropsWithoutRef<
	React.ComponentProps<"input"> & {
		variant?: "unstyled";
		fullWidth?: boolean;
		scale?: "sm" | "base" | "lg";
		showClear?: boolean;
		onClear?: () => void | Promise<void>;
	}
>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			variant,
			className,
			showClear,
			onClear,
			fullWidth,
			scale = "base",
			...props
		}: InputProps,
		theirRef,
	) => {
		const ref = React.useRef<HTMLInputElement | null>(null);

		const inputElement = React.useMemo(() => {
			return (
				<input
					ref={mergeRefs([ref, theirRef])}
					className={clsx(
						variant !== "unstyled" &&
							"text-black dark:text-white rounded outline-none border border-gray-300 focus:border-gray-400 caret-black dark:bg-gray-900 dark:focus:border-gray-700 dark:border-gray-600 dark:focus:bg-gray-800 dark:caret-white dark:placeholder-gray-400",
						{
							"text-xs px-1.5 h-6": scale === "sm",
							"text-sm px-2.5 h-8": scale === "base",
							"text-base px-4 h-10": scale === "lg",
						},
						fullWidth && "w-full",
						className,
					)}
					{...props}
				/>
			);
		}, [className, props, theirRef]);

		if (showClear)
			return (
				<div className="relative w-full">
					{inputElement}
					{ref?.current && ref.current?.value?.length > 0 ? (
						<button
							className={clsx([
								"bg-transparent text-gray-500 px-2 absolute right-0 top-0 h-full",
							])}
							onClick={() => {
								if (ref?.current) ref.current.value = "";
								if (onClear) onClear();
							}}
						>
							<HiX />
						</button>
					) : null}
				</div>
			);

		return inputElement;
	},
);

Input.displayName = "Input";
