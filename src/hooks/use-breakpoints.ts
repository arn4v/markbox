import useMediaQuery from "./use-mediaquery";

export default function useBreakpoints() {
	const isSm = useMediaQuery("(min-width: 640px)");
	const isMd = useMediaQuery("(min-width: 768px)");
	const isLg = useMediaQuery("(min-width: 1024px)");
	const isXl = useMediaQuery("(min-width: 1280px)");
	const isXxl = useMediaQuery("(min-width: 1536px)");

	return { isSm: isSm, isMd: isMd, isLg: isLg, isXl: isXl, isXxl: isXxl };
}
