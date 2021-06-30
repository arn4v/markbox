import * as React from "react";
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import { getTargetChildren } from "~/lib/react";
import { Portal, PortalProps } from "@reach/portal";

type ModalProps = {
	portalProps?: PortalProps;
	containerProps?: {
		className?: string;
	};
	overlayProps?: {
		className?: string;
	};
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

interface Modal extends Component<ModalProps> {}

const Modal: Modal = ({
	children,
	isOpen,
	onClose,
	containerProps,
	overlayProps,
	portalProps,
}) => {
	const [withTarget] = React.useMemo(
		() => getTargetChildren(children, ModalContent),
		[children],
	);

	const onEscape = React.useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		},
		[onClose],
	);

	React.useEffect(() => {
		if (isOpen) {
			document.addEventListener("keydown", onEscape, false);
		} else {
			document.removeEventListener("keydown", onEscape, false);
		}
	}, [onEscape, isOpen]);

	return (
		<Portal {...portalProps}>
			<AnimatePresence>
				{isOpen && (
					<div
						className={clsx([
							"h-screen w-screen fixed inset-0 overflow-none",
							containerProps?.className ?? "z-[100]",
						])}
					>
						<motion.div
							className={clsx([
								"z-10 fixed inset-0 bg-black",
								overlayProps?.className,
							])}
							style={
								{
									"--tw-bg-opacity": 0.4,
								} as any
							}
							variants={{
								open: { opacity: 1, pointerEvents: "auto" },
								closed: { opacity: 0, pointerEvents: "none" },
							}}
							initial="closed"
							animate="open"
							exit="closed"
							transition={{ type: "tween" }}
							onClick={onClose}
						/>
						{withTarget}
					</div>
				)}
			</AnimatePresence>
		</Portal>
	);
};

Modal.displayName = "Drawer";

interface DrawerContentProps extends HTMLMotionProps<"div"> {
	children: React.ReactNode;
}

export const ModalContent = React.forwardRef<
	HTMLDivElement,
	DrawerContentProps
>(({ children, className, ...props }, ref) => {
	return (
		<motion.div
			ref={ref}
			className={clsx(["absolute z-30", className])}
			transition={{ type: "spring", stiffness: 350, damping: 40 }}
			{...props}
		>
			{children}
		</motion.div>
	);
});

ModalContent.displayName = "ModalContent";

export default Modal;
