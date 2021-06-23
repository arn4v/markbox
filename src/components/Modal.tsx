import * as React from "react";
import { AnimatePresence, motion, Transition, Variants } from "framer-motion";
import { DialogOverlay, DialogContent } from "@reach/dialog";

interface ModalType {
	(props: ModalProps): JSX.Element;
	Content: typeof ModalContent;
}

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ModalChildren | Array<ModalChildren>;
	overlayTransitionDuration: number;
}

type ModalChildren = React.ReactElement<MotionContentProps>;

const MotionOverlay = motion(DialogOverlay);

const overlayVariants: Variants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
};

const Modal: ModalType = ({
	children,
	isOpen,
	onClose,
	overlayTransitionDuration,
}: ModalProps) => {
	const content = React.useMemo(() => {}, [children]);

	if (!isOpen) return null;

	return (
		<AnimatePresence exitBeforeEnter>
			<MotionOverlay
				onDismiss={onClose}
				transition={{
					ease: "easeInOut",
					duration: overlayTransitionDuration ?? 0.3,
				}}
				variants={overlayVariants}
				initial="initial"
				animate="animate"
				exit="initial">
				{children}
			</MotionOverlay>
		</AnimatePresence>
	);
};

/* -------------------------------------------------------------------------- */
/*                           Modal Content Component                          */
/* -------------------------------------------------------------------------- */

const MotionContent = motion(DialogContent);

type MotionContentProps = React.ComponentProps<typeof MotionContent>;

const ModalContent = (props: MotionContentProps): JSX.Element => {
	return <MotionContent {...props} />;
};

Modal.Content = ModalContent;
export default Modal;
