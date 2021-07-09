import { Portal, PortalProps } from "@reach/portal";
import clsx from "clsx";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import * as React from "react";
import { getTargetChildren } from "~/lib/react";

type DrawerProps = {
	portalProps?: Omit<PortalProps, "children">;
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

interface DrawerComponent extends Component<DrawerProps> {}

const Drawer: DrawerComponent = ({
	children,
	isOpen,
	onClose,
	containerProps,
	overlayProps,
	portalProps,
}) => {
	const [withTarget] = React.useMemo(
		() => getTargetChildren(children, DrawerContent),
		[children],
	);

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
							onClick={onClose}
						/>
						{withTarget}
					</div>
				</Portal>
			)}
		</AnimatePresence>
	);
};

Drawer.displayName = "Drawer";

interface DrawerContentProps extends HTMLMotionProps<"div"> {
	children: React.ReactNode;
	placement: "top" | "bottom" | "left" | "right";
}

export const DrawerContent = React.forwardRef<
	HTMLDivElement,
	DrawerContentProps
>(({ children, placement, className }, ref) => {
	const [openVariant, closeVariant] = React.useMemo(() => {
		if (placement === "bottom") {
			return [
				{
					y: "0",
				},
				{
					y: "100%",
				},
			];
		}

		if (placement === "top") {
			return [
				{
					y: "0",
				},
				{
					y: "-100%",
				},
			];
		}

		if (placement === "left") {
			return [
				{
					x: "0",
				},
				{
					x: "-100%",
				},
			];
		}

		if (placement === "right") {
			return [
				{
					x: "0",
				},
				{
					x: "100%",
				},
			];
		}

		return [{}, {}];
	}, [placement]);

	return (
		<motion.div
			ref={ref}
			className={clsx([
				"absolute z-30",
				placement === "top" && "top-0",
				placement === "bottom" && "bottom-0",
				placement === "left" && "left-0",
				placement === "right" && "right-0",
				className,
			])}
			initial="closed"
			animate="open"
			exit="closed"
			variants={{
				open: { opacity: 1, ...openVariant },
				closed: { opacity: 0, ...closeVariant },
			}}
			transition={{ type: "spring", stiffness: 350, damping: 40 }}
		>
			{children}
		</motion.div>
	);
});

DrawerContent.displayName = "DrawerContent";

export default Drawer;
