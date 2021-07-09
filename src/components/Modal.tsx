import { Portal, PortalProps } from "@reach/portal";
import clsx from "clsx";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import * as React from "react";
import { getTargetChildren } from "~/lib/react";

type ModalProps = {
	portalProps?: Omit<PortalProps, "children">;
	containerProps?: {
		className?: string;
	};
	overlayProps?: HTMLMotionProps<"div">;
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

	React.useEffect(() => {
		const onEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};

		const onScroll = (e) => {
			e.preventDefault();
			window.scrollTo(0, 0);
		};

		if (isOpen) {
			document.addEventListener("scroll", onScroll);
			document.addEventListener("touchmove", onScroll);
			document.addEventListener("onsc", onEscape, false);
		} else {
			document.removeEventListener("scroll", onScroll);
			document.removeEventListener("touchmove", onScroll);
			document.removeEventListener("keydown", onEscape, false);
		}
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<Portal {...portalProps}>
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
				</Portal>
			)}
		</AnimatePresence>
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
