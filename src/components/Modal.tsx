import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { genericModalMotionProps } from "~/config";

const MotionOverlay = motion(DialogPrimitive.DialogOverlay);
const MotionContent = motion(DialogPrimitive.DialogContent);

export type ModalProps = {
	isOpen: boolean;
	onClose(): void | Promise<void>;
	children: React.ReactNode;
	portalProps?: DialogPrimitive.PortalProps;
	contentProps?: Omit<React.ComponentProps<typeof MotionContent>, "ref">;
	overlayProps?: React.ComponentProps<typeof MotionOverlay>;
};

interface Modal extends Component<ModalProps> {}

const Modal: Modal = ({
	children,
	isOpen,
	onClose,
	overlayProps,
	portalProps,
	contentProps,
}) => {
	const onEscape = React.useCallback(
		(event: KeyboardEvent) => {
			event.stopPropagation();
			if (event.key === "Escape") onClose();
		},
		[onClose],
	);

	React.useEffect(() => {
		document.addEventListener("keydown", onEscape, false);
		return () => document.removeEventListener("keydown", onEscape, false);
	}, [isOpen, onEscape]);

	return (
		<DialogPrimitive.Root open={isOpen}>
			<AnimatePresence>
				{isOpen ? (
					<>
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
								data-test="modal-content"
								className={clsx([
									"fixed z-[200] transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2",
								])}
								forceMount
							>
								<motion.div {...contentProps} {...genericModalMotionProps}>
									{children}
								</motion.div>
							</MotionContent>
						</DialogPrimitive.Portal>
					</>
				) : null}
			</AnimatePresence>
		</DialogPrimitive.Root>
	);
};

export default Modal;
