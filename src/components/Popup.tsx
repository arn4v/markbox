import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useOnClickOutside } from "react-sensible";
import { mergeRefs } from "~/lib/react";
import styles from "./Popup.module.css";

export type PopupProps = JSX.IntrinsicElements["div"] & {
	isOpen: boolean;
	onDismiss: () => void;
	className?: string;
	children: React.ReactNode;
	trigger: React.ReactNode;
	toAnimate?: boolean;
	showOverlay?: boolean;
	placement?:
		| "left"
		| "left-top"
		| "left-bottom"
		| "right"
		| "right-top"
		| "right-bottom"
		| "top"
		| "top-end"
		| "top-start"
		| "bottom"
		| "bottom-end"
		| "bottom-start"
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
			showOverlay = false,
			...props
		},
		ref,
	) => {
		const internalRef = React.useRef<HTMLDivElement>(null);
		useOnClickOutside(internalRef, onDismiss);

		return (
			<div ref={mergeRefs([internalRef, ref])} className="relative">
				{button}
				<AnimatePresence exitBeforeEnter>
					{isOpen && showOverlay && (
						<motion.div
							className="z-10 fixed inset-0 bg-black"
							style={
								{
									"--tw-bg-opacity": 0.4,
								} as any
							}
							variants={{
								open: { opacity: 1, pointerEvents: "auto" as const },
								closed: { opacity: 0, pointerEvents: "none" as const },
							}}
							initial="closed"
							animate="open"
							exit="closed"
							transition={{ type: "tween" }}
							onClick={onDismiss}
						/>
					)}
					{isOpen && (
						<div
							className={clsx([
								"absolute z-30 rounded-lg",
								toAnimate && styles.popup,
								placement !== "custom" && "transform",
								placement === "bottom-end" && "left-0 top-full",
								placement === "bottom-start" && "top-full right-0",
								placement === "left-bottom" && "right-full bottom-0",
								placement === "left-top" && "right-full top-0",
								placement === "right-bottom" && "left-full bottom-0",
								placement === "right-top" && "left-full top-0",
								placement === "top-end" && "bottom-full left-0",
								placement === "top-start" && "bottom-full right-0",
								placement === "bottom" && "top-full left-1/2 -translate-x-1/2",
								placement === "left" && "right-full top-1/2 -translate-y-1/2",
								placement === "right" && "left-full top-1/2 -translate-y-1/2",
								placement === "top" && "bottom-full left-1/2 -translate-x-1/2",
								className,
							])}
							{...props}
						>
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
