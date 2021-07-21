import clsx from "clsx";
import * as React from "react";

type Props = JSX.IntrinsicElements["input"] & {
	as?: "input" | "textarea";
};

const Input = React.forwardRef<HTMLInputElement, Props>(
	({ className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={clsx(
					"text-black dark:text-white rounded outline-none border border-gray-300 focus:border-gray-400 caret-black dark:bg-gray-900 dark:focus:border-gray-700 dark:border-gray-600 dark:focus:bg-gray-800 dark:caret-white dark:placeholder-gray-400 dark:border-transparent",
					className,
				)}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";

export type { Props as InputProps };
export default Input;
