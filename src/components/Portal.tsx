import * as React from "react";
import { createPortal } from "react-dom";
import { useIsomorphicLayoutEffect } from "react-use";

interface Props {
	children?: React.ReactNode;
	type?: string;
}

export default function Portal({ children, type = "portal" }: Props) {
	const portalNode = React.useRef<HTMLDivElement>(null);

	useIsomorphicLayoutEffect(() => {
		const existingNode = document.querySelectorAll("body > div." + type);
		if (!existingNode) {
			const el = document.createElement("div");
			el.className = type;
			const bodyEl = document.getElementsByTagName("body")[0];
			bodyEl.append(el);
		}
	}, [children, type]);

	return portalNode.current
		? createPortal(children, portalNode.current)
		: undefined;
}
