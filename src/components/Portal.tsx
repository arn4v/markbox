import * as React from "react";
import { createPortal } from "react-dom";
import { useIsomorphicLayoutEffect } from "react-use";
import { isSsr } from "~/config";

interface Props {
	children?: React.ReactNode;
	type?: string;
}

export default function Portal({ children, type = "portal" }: Props) {
	const portalNode = React.useRef<HTMLDivElement | null>(null);

	useIsomorphicLayoutEffect(() => {
		const existingNode = Array.from(
			document.querySelectorAll("body > div." + type),
		)[0];
		if (!existingNode) {
			const el = document.createElement("div");
			el.className = type;
			el.setAttribute("data-portal-type", type);
			document.body.append(el);
			portalNode.current = el;
		}
		() => {
			if (portalNode.current) document.body.removeChild(portalNode?.current);
		};
	}, [children, type]);

	if (isSsr) return null;
	return portalNode.current ? createPortal(children, portalNode.current) : null;
}
