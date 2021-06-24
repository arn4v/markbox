import React, { useRef } from "react";
import { motion } from "framer-motion";
import useTargetChildren from "~/hooks/use-target-children";

type DrawerProps = {
	placement: "left" | "right";
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

interface DrawerComponent extends React.FC<DrawerProps> {
	Content: typeof DrawerContent;
}

const Drawer: DrawerComponent = ({ placement, children, isOpen, onClose }) => {
	const drawerRef = useRef<null | HTMLDivElement>(null);
	const [withTarget] = useTargetChildren(children, DrawerContent);

	return (
		<>
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
				animate={isOpen ? "open" : "closed"}
				transition={{ type: "tween" }}
				onClick={onClose}
			/>
		</>
	);
};

Drawer.displayName = "Drawer";

const DrawerContent: React.ForwardRefExoticComponent<{}> =
	React.forwardRef<HTMLDivElement>(({}, ref) => {
		return (
			<motion.div
				ref={ref}
				className="fixed top-0 bottom-0 z-30"
				initial="closed"
				animate={isOpen ? "open" : "closed"}
				variants={{
					open: { opacity: 1, x: 0 },
					closed: { opacity: 0, x: "-100%" },
				}}
				transition={{ type: "spring", stiffness: 350, damping: 40 }}>
				{children}
			</motion.div>
		);
	});

Drawer.Content = DrawerContent;
export default Drawer;
