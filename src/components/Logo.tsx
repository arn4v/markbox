import { ImageProps } from "next/image";

interface Props {
	className?: string;
}

export const Logo = (props: Omit<ImageProps, "src" | "alt">) => {
	return <img src={"/logo-text.svg"} alt="Markbox Logo" {...props} />;
};

Logo.baseHeight = 29;
Logo.baseWidth = 169;
