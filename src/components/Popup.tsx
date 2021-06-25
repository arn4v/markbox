import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import useOnClickOutside from "~/hooks/use-onclickoutside";
import { mergeRefs } from "~/lib/react";
import styles from "./Popup.module.css";

export type PopupProps = JSX.IntrinsicElements["div"] & {
	isOpen: boolean;
	onDismiss: () => void;
	className?: string;
	children: React.ReactNode;
	trigger: React.ReactNode;
	toAnimate?: boolean;
	placement?:
		| "left"
		| "left-top"
		| "left-bottom"
		| "right"
		| "right-top"
		| "right-bottom"
		| "top"
		| "top-left"
		| "top-right"
		| "bottom"
		| "bottom-left"
		| "bottom-right"
		| "custom";
};

const Popup = React.forwardRef<HTMLDivElement, PopupProps>(
	(
		{
			trigger: button,
			children,
			onDismiss,
			isOpen,
			className,
			toAnimate = false,
			placement = "bottom",
			...props
		},
		ref: React.MutableRefObject<HTMLDivElement>,
	) => {
		const internalRef = React.useRef<HTMLDivElement>(null);
		useOnClickOutside(internalRef, onDismiss);

		return (
			<div
				ref={(node) => {
					mergeRefs(node, internalRef, ref);
				}}
				className="relative">
				{button}
				<AnimatePresence exitBeforeEnter>
					{isOpen && (
						<div
							className={clsx([
								"absolute z-30 rounded-lg",
								toAnimate && styles.popup,
								placement !== "custom" && "transform",
								placement === "bottom-left" && "left-0 top-full",
								placement === "bottom-right" && "top-full right-0",
								placement === "left-bottom" && "right-full bottom-0",
								placement === "left-top" && "right-full top-0",
								placement === "right-bottom" && "left-full bottom-0",
								placement === "right-top" && "left-full top-0",
								placement === "top-left" && "bottom-full left-0",
								placement === "top-right" && "bottom-full right-0",
								placement === "bottom" && "top-full left-1/2 -translate-x-1/2",
								placement === "left" && "right-full top-1/2 -translate-y-1/2",
								placement === "right" && "left-full top-1/2 -translate-y-1/2",
								placement === "top" && "bottom-full left-1/2 -translate-x-1/2",
								className,
							])}
							{...props}>
							{children}
						</div>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

Popup.displayName = "Popup";

export default Popup;
