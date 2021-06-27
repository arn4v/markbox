import * as React from "react";

export default function useDisclosure() {
	const [isOpen, setOpen] = React.useState<boolean>(false);

	const onOpen = () => setOpen(true);
	const onClose = () => setOpen(false);
	const onToggle = () => setOpen((prev) => !prev);

	return { isOpen, onOpen, onClose, onToggle };
}
