import * as React from "react";
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";
import Portal from "./Portal";
import clsx from "clsx";
import { getTargetChildren } from "~/lib/react-children";

type DrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

interface DrawerComponent extends Component<DrawerProps> {}

const Drawer: DrawerComponent = ({ children, isOpen, onClose }) => {
	const [withTarget] = React.useMemo(
		() => getTargetChildren(children, DrawerContent),
		[children],
	);

	return (
		<Portal>
			<AnimatePresence>
				{isOpen && (
					<div className="h-screen w-screen fixed inset-0 overflow-none">
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
							onClick={onClose}
						/>
						{/* {children} */}
						{withTarget}
					</div>
				)}
			</AnimatePresence>
		</Portal>
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
			transition={{ type: "spring", stiffness: 350, damping: 40 }}>
			{children}
		</motion.div>
	);
});

DrawerContent.displayName = "DrawerContent";

export default Drawer;
