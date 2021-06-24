import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import useOnClickOutside from "~/hooks/use-onclickoutside";

export interface PopupProps {
	button: React.ReactNode;
	isOpen: boolean;
	onDismiss: () => void;
	className?: string;
	children: React.ReactNode;
}

const Popup = React.forwardRef<HTMLDivElement, PopupProps>(
	(
		{ button, children, onDismiss, isOpen, className },
		// TODO: Fix forwardRef type - it should be RefObject<T>
		ref,
	) => {
		const internalRef = React.useRef<HTMLDivElement>(null);
		useOnClickOutside(internalRef, onDismiss);

		return (
			<div
				ref={(node) => {
					internalRef.current = node;
					if (typeof ref === "function") {
						ref(node);
					} else if (ref) {
						(ref as React.MutableRefObject<HTMLDivElement>).current = node;
					}
				}}
				className="relative">
				{button}
				<AnimatePresence exitBeforeEnter>
					{isOpen && (
						<motion.div
							initial={{ y: -20 }}
							animate={{ y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className={clsx([
								"absolute z-30 p-4 ml-4 rounded-lg left-full dark:bg-blueGray-700 dark:border-blueGray-600",
								className,
							])}>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

export default Popup;
