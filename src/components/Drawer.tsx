import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

const MotionOverlay = motion(DialogPrimitive.DialogOverlay);
const MotionContent = motion(DialogPrimitive.DialogContent);

type DrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	position: "top" | "bottom" | "left" | "right";
	children: React.ReactNode;
	portalProps?: Omit<DialogPrimitive.PortalProps, "children">;
	contentProps?: Omit<React.ComponentProps<typeof MotionContent>, "ref">;
	overlayProps?: React.ComponentProps<typeof MotionOverlay>;
};

export const Drawer = ({
	children,
	isOpen,
	onClose,
	position,
	contentProps,
	overlayProps,
	portalProps,
}: DrawerProps) => {
	const [openVariant, closeVariant] = React.useMemo(() => {
		switch (position) {
			case "top": {
				return [{ y: "0" }, { y: "-100%" }];
			}
			case "bottom": {
				return [{ y: "0" }, { y: "100%" }];
			}
			case "left": {
				return [{ x: "0" }, { x: "-100%" }];
			}
			case "right": {
				return [{ x: "0" }, { x: "100%" }];
			}
			default: {
				return [{}, {}];
			}
		}
	}, [position]);

	React.useEffect(() => {
		const onEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};

		/**
		 * onScroll and onTouchMove are used to stop viewport
		 * scrolling when modal or drawer are open
		 */

		// const onScroll = (e: Event) => {
		// 	e.preventDefault();
		// 	window.scrollTo(0, 0);
		// };

		if (isOpen) {
			// document.addEventListener("scroll", onScroll);
			// document.addEventListener("touchmove", onScroll);
			document.addEventListener("keydown", onEscape, false);
		} else {
			// document.removeEventListener("scroll", onScroll);
			// document.removeEventListener("touchmove", onScroll);
			document.removeEventListener("keydown", onEscape, false);
		}
	}, [isOpen, onClose]);

	return (
		<DialogPrimitive.Root open={isOpen}>
			<AnimatePresence>
				{isOpen && (
					<DialogPrimitive.Portal {...portalProps} forceMount>
						<MotionOverlay
							{...overlayProps}
							data-test="modal-overlay"
							className={clsx([
								"fixed inset-0 bg-black bg-opacity-75 z-[100]",
								overlayProps?.className,
							])}
							variants={{
								open: { opacity: 1, pointerEvents: "auto" },
								closed: { opacity: 0, pointerEvents: "none" },
							}}
							initial="closed"
							animate="open"
							exit="closed"
							transition={{ type: "tween" }}
							onClick={onClose}
							forceMount
						/>
						<MotionContent
							data-test="drawer-radix-content"
							{...contentProps}
							className={clsx([
								"fixed top-0 bottom-0 z-[200] w-auto min-w-[450px]",
								position === "top" && "bottom-auto",
								position === "bottom" && "top-auto",
								position === "left" && "left-0",
								position === "right" && "right-0",
								contentProps?.className,
							])}
							initial="closed"
							animate="open"
							exit="closed"
							variants={{
								open: { opacity: 1, ...openVariant },
								closed: { opacity: 0, ...closeVariant },
							}}
							transition={{ type: "spring", stiffness: 350, damping: 40 }}
							forceMount
						>
							{children}
						</MotionContent>
					</DialogPrimitive.Portal>
				)}
			</AnimatePresence>
		</DialogPrimitive.Root>
	);
};
