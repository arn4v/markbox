import * as React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
	DialogOverlay,
	DialogContent,
	DialogContentProps,
	DialogOverlayProps,
} from "@reach/dialog";

interface ModalType {
	(props: ModalProps): JSX.Element;
	Content: typeof ModalContent;
}

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ModalChildren | Array<ModalChildren>;
	overlayTransitionDuration?: number;
} & React.ComponentProps<typeof MotionOverlay>;

type ModalChildren = React.ReactElement<ModalContentProps>;

const MotionOverlay = motion(DialogOverlay);

const overlayVariants: Variants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 0.5,
	},
};

const Modal: ModalType = ({
	children,
	isOpen,
	onClose,
	overlayTransitionDuration,
	...props
}: ModalProps) => {
	return (
		<AnimatePresence exitBeforeEnter>
			{isOpen && (
				<MotionOverlay
					as="div"
					style={{ backgroundColor: "black" }}
					onDismiss={onClose}
					transition={{
						ease: "easeInOut",
						duration: overlayTransitionDuration ?? 0.3,
					}}
					variants={overlayVariants}
					initial="initial"
					animate="animate"
					exit="initial"
					{...props}>
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

export type ModalContentProps = React.ComponentProps<typeof MotionContent> & {
	children?: React.ReactNode;
};

const ModalContent = ({
	children,
	...props
}: ModalContentProps): JSX.Element => {
	// TODO: Wrap in motion()
	// Currently throws error
	// Type '{ children: ReactNode; as: "div"; }' is not assignable to type 'IntrinsicAttributes & Pick<{ as?: "div"; } & Omit<Pick<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof HTMLAttributes<...>> & { ...; }, "children" | "as"> & MotionProps, "title" | ... 250 more ... | "css"> & RefAttributes<...>'. Property 'children' does not exist on type 'IntrinsicAttributes & Pick<{ as?: "div"; } & Omit<Pick<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof HTMLAttributes<...>> & { ...; }, "children" | "as"> & MotionProps, "title" | ... 250 more ... | "css"> & RefAttributes<...>'.

	return <MotionContent as="div" {...props} />;
};

Modal.Content = ModalContent;
export default Modal;
