import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import { getDocsSlugs, getSourceFromSlugArray } from "~/lib/docs-mdx";

interface Props {
	code: string;
	frontmatter: Metadata;
}

interface Metadata {
	seo_title: string;
	title: string;
}

export default function DocsPage({ code, frontmatter }: Props) {
	const Component = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<>
			<Component />
		</>
	);
}

export const getStaticProps: GetStaticProps<{}, { slug: string[] }> = async (
	ctx,
) => {
	const source = getSourceFromSlugArray(ctx.params.slug);
	const { code, frontmatter } = await bundleMDX(source, {
		xdmOptions(options) {
			options.rehypePlugins = [
				...(options.rehypePlugins ?? []),
				require("mdx-prism"),
			];

			options.remarkPlugins = [
				...(options.remarkPlugins ?? []),
				require("remark-autolink-headings"),
				require("remark-code-titles"),
				require("remark-slug"),
			];

			return options;
		},
	});

	return {
		props: {
			code,
			frontmatter: frontmatter as Metadata,
		},
	};
};

export const getStaticPaths: GetStaticPaths<{ slug: string[] }> = async () => {
	const slugs = getDocsSlugs();

	return {
		paths: slugs.map((item) => {
			return {
				params: { slug: item.replace(/\.mdx/, "").split("/") },
			};
		}),
		fallback: false,
	};
};
