import clsx from "clsx";
import * as React from "react";
import { mergeRefs } from "~/lib/react";
import { Colors } from "~/types/Colors";

type Props = JSX.IntrinsicElements["button"] & {
	variant: "outline" | "solid";
	color: Colors;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(
	(
		{ className = "", variant, color, ...props },
		ref: React.Ref<HTMLButtonElement>,
	) => {
		const internalRef: React.MutableRefObject<HTMLButtonElement | null> =
			React.useRef(null);

		return (
			<button
				{...props}
				ref={mergeRefs([internalRef, ref])}
				className={clsx([
					!/(bg-(.*)|border-(.*))/.test(className) &&
						`bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-none hover:bg-gray-200 dark:hover:bg-gray-600`,
					variant === "solid" && ``,
					variant === "outline" && ``,
					className,
				])}
			/>
		);
	},
);

Button.displayName = "Button";

export type { Props as ButtonProps };
export default Button;
