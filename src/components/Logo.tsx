import Image, { ImageProps } from "next/image";

interface Props {
	className?: string;
}

export const Logo = (props: Omit<ImageProps, "src" | "alt">) => {
	return (
		<Image
			src={"/logo-text.svg"}
			height={29}
			width={169}
			alt="Markbox Logo"
			{...props}
		/>
	);
};

Logo.baseHeight = 29;
Logo.baseWidth = 169;
