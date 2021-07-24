import { useMediaQuery } from "react-sensible";

export default function useIsPwa() {
	const isPwa = useMediaQuery("(display-mode: standalone)");

	return isPwa;
}
