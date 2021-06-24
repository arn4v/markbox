import clsx from "clsx";
import Modal, { ModalProps, ModalContentProps } from "./Modal";

type DrawerProps = ModalProps & ModalContentProps;

export default function Drawer({
	isOpen,
	onClose,
	className,
	...props
}: DrawerProps) {
	return (
		<>
			<style jsx scoped>
				{`
					[data-reach-dialog-content] {
						margin: 0;
					}
				`}
			</style>
			<Modal
				onClose={onClose}
				isOpen={isOpen}
				className="h-[100vh] w-[100vw] overflow-hidden relative">
				<Modal.Content
					className={clsx(["right-0 absolute h-full", className])}
					variants={{
						initial: {
							x: "100%",
						},
						animate: {
							x: 0,
						},
					}}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{
						duration: 0.5,
						ease: "easeInOut",
					}}
					{...props}
				/>
			</Modal>
		</>
	);
}
