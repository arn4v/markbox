import * as React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
	DialogOverlay,
	DialogContent,
	DialogContentProps,
} from "@reach/dialog";

interface ModalType {
	(props: ModalProps): JSX.Element;
	Content: typeof ModalContent;
}

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ModalChildren | Array<ModalChildren>;
	overlayTransitionDuration?: number;
}

type ModalChildren = React.ReactElement<DialogContentProps>;

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
	return (
		<AnimatePresence exitBeforeEnter>
			{isOpen && (
				<MotionOverlay
					style={{ backgroundColor: "black" }}
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
			)}
		</AnimatePresence>
	);
};

/* -------------------------------------------------------------------------- */
/*                           Modal Content Component                          */
/* -------------------------------------------------------------------------- */

const MotionContent = motion(DialogContent);

const ModalContent = ({ children }: DialogContentProps): JSX.Element => {
	// TODO: Wrap in motion()
	// Currently throws error
	// Type '{ children: ReactNode; as: "div"; }' is not assignable to type 'IntrinsicAttributes & Pick<{ as?: "div"; } & Omit<Pick<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof HTMLAttributes<...>> & { ...; }, "children" | "as"> & MotionProps, "title" | ... 250 more ... | "css"> & RefAttributes<...>'. Property 'children' does not exist on type 'IntrinsicAttributes & Pick<{ as?: "div"; } & Omit<Pick<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof HTMLAttributes<...>> & { ...; }, "children" | "as"> & MotionProps, "title" | ... 250 more ... | "css"> & RefAttributes<...>'.
	const MotionDialogContent = DialogContent;

	return <MotionDialogContent as="div">{children}</MotionDialogContent>;
};

Modal.Content = ModalContent;
export default Modal;
