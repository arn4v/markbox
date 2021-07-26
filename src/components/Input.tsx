import clsx from "clsx";
import * as React from "react";
import { HiX } from "react-icons/hi";
import { mergeRefs } from "~/lib/react";

type Props = JSX.IntrinsicElements["input"] & {
	showClear?: boolean;
	onClear?: () => void | Promise<void>;
};

const Input = React.forwardRef(
	(
		{ className, ...props }: Props,
		theirRef: React.MutableRefObject<HTMLInputElement>,
	) => {
		const ref = React.useRef<HTMLInputElement>(null);

		const inputElement = React.useMemo(() => {
			return (
				<input
					ref={(node) => {
						mergeRefs(node, ref, theirRef);
					}}
					className={clsx(
						"text-black dark:text-white rounded outline-none border border-gray-300 focus:border-gray-400 caret-black dark:bg-gray-900 dark:focus:border-gray-700 dark:border-gray-600 dark:focus:bg-gray-800 dark:caret-white dark:placeholder-gray-400",
						className,
					)}
					{...props}
				/>
			);
		}, [className, props, theirRef]);

		if (props.showClear)
			return (
				<div className="relative w-full">
					{inputElement}
					{ref.current?.value?.length > 0 ? (
						<button
							className={clsx([
								"bg-transparent text-gray-500 px-2 absolute right-0 top-0 h-full",
							])}
							onClick={() => {
								ref.current.value = "";
								if (props.onClear) props.onClear();
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

export type { Props as InputProps };
export default Input;
