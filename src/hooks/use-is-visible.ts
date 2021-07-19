import * as React from "react";

const useIsVisible = <T extends HTMLElement>(
	ref: React.RefObject<T> | React.MutableRefObject<T>,
): boolean => {
	const [isVisible, setVisible] = React.useState<boolean>(false);
	const intersectionObserverRef = React.useRef<IntersectionObserver>(null);

	React.useEffect(() => {
		if (!intersectionObserverRef.current) {
			intersectionObserverRef.current = new IntersectionObserver(
				() => {
					const rect = ref.current.getBoundingClientRect();
					console.log(rect);
					setVisible(
						rect.top >= 0 &&
							rect.left >= 0 &&
							rect.bottom <=
								(window.innerHeight ?? document.documentElement.clientHeight) &&
							rect.right <=
								(window.innerWidth ?? document.documentElement.clientWidth),
					);
				},
				{
					root: null,
				},
			);
			intersectionObserverRef.current.observe(ref.current);
		}
	}, [ref]);

	return isVisible;
};

export default useIsVisible;
