import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import { HiArrowRight } from "react-icons/hi";
import { Logo } from "~/components/Logo";
import { getDocsSlugs, getSourceFromSlugArray } from "~/lib/docs-mdx";

interface Props {
	code: string;
	metadata: Metadata;
}

interface Metadata {
	seo_title: string;
	title: string;
}

export default function DocsPage({ code, metadata }: Props) {
	const Component = React.useMemo(() => getMDXComponent(code), [code]);
	const { theme, setTheme } = useTheme();
	return (
		<>
			<NextSeo title={metadata.seo_title} />
			<div className="w-screen h-screen bg-blueGray-50">
				<div className="flex w-3/5 h-full mx-auto">
					<div className="sticky w-1/5 h-full pt-8 border-r border-gray-300">
						<Logo className="scale-[90%] text-dark" />
					</div>
					<div className="flex flex-col flex-grow pt-8">
						<Link href="/login">
							<a className="flex items-center gap-2 ml-auto">
								Login <HiArrowRight />
							</a>
						</Link>
						<article className="pt-8 flex-grow-1">
							<h1>{metadata.title}</h1>
							<Component />
						</article>
					</div>
				</div>
			</div>
		</>
	);
}

export const getStaticProps: GetStaticProps<Props, { slug: string[] }> = async (
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
			metadata: frontmatter as Metadata,
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
