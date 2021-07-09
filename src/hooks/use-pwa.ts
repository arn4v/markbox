import useMediaQuery from "./use-mediaquery";

export default function useIsPwa() {
	const isPwa = useMediaQuery("(display-mode: standalone)");

	return isPwa;
}
