import * as React from "react";

export default function useDisclosure(initialState: boolean = false) {
	const [isOpen, setOpen] = React.useState<boolean>(initialState);

	const onOpen = () => setOpen(true);
	const onClose = () => setOpen(false);
	const onToggle = () => setOpen((prev) => !prev);

	return { isOpen, onOpen, onClose, onToggle };
}
