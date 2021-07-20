import * as React from "react";

type HTMLElementRef =
	| React.RefObject<HTMLElement>
	| React.MutableRefObject<HTMLElement>;

type UseInterSectionObserver = (params: {
	root: HTMLElementRef;
	target: HTMLElementRef;
	onIntersect: () => void | Promise<void>;
	threshold?: number;
	rootMargin?: `${string}px`;
	enabled?: boolean;
}) => void;

const useIntersectionObserver: UseInterSectionObserver = ({
	root,
	target,
	onIntersect,
	threshold = 1.0,
	rootMargin = "0px",
	enabled = true,
}) => {
	const intersectionObserverRef = React.useRef<IntersectionObserver>(null);

	React.useEffect(() => {
		if (!enabled || intersectionObserverRef.current) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) => entry.isIntersecting && onIntersect()),
			{
				root: root && root.current,
				rootMargin,
				threshold,
			},
		);

		const el = target && target.current;

		if (!el) {
			return;
		}

		observer.observe(el);

		return () => {
			observer.unobserve(el);
		};
	}, [target, enabled, root, rootMargin, threshold, onIntersect]);
};

export default useIntersectionObserver;
