import clsx from "clsx";
import * as React from "react";
import { mergeRefs } from "~/lib/react";
import Spinner from "./Spinner";

type Props = JSX.IntrinsicElements["button"] & {
	variant: "outline" | "solid" | "unstyled";
	// color: Colors;
	isLoading?: boolean;
	loader?: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(
	(
		{
			className = "",
			variant,
			isLoading = false,
			disabled,
			loader = <Spinner />,
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
				className={clsx([
					variant !== "unstyled" && !/(bg-(.*)|border-(.*))/.test(className)
						? `bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-none hover:bg-gray-200 dark:hover:bg-gray-600`
						: null,
					"min-w-[max-content]",
					className,
				])}
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

export type { Props as ButtonProps };
export default Button;
