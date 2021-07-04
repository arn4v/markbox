import Link from "next/link";

const MDXLink = ({ href, ...props }: JSX.IntrinsicElements["a"]) => {
	const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

	if (isInternalLink) {
		return (
			<Link href={href} passHref>
				<a {...props}>{props.children}</a>
			</Link>
		);
	}

	return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

export default MDXLink;
