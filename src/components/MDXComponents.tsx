import Link from "next/link";
import * as React from "react";

const MDXLink = ({ href, ...props }: JSX.IntrinsicElements["a"]) => {
	const isInternalLink = React.useMemo(
		() => href && (href.startsWith("/") || href.startsWith("#")),
		[href],
	);

	if (isInternalLink) {
		return (
			<Link href={href}>
				<a {...props}>{props.children}</a>
			</Link>
		);
	}

	return <a target="_blank" rel="noopener noreferrer" href={href} {...props} />;
};

const MDXComponents = {
	a: MDXLink,
};

export default MDXComponents;
