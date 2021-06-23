import * as React from "react";

export default function useDisclosure() {
	const [isOpen, setOpen] = React.useState<boolean>(false);

	const onOpen = () => setOpen(true);
	const onClose = () => setOpen(false);

	return { isOpen, onOpen, onClose };
}
