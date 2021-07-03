import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import * as React from "react";
import { HiArrowRight } from "react-icons/hi";
import { useAuth } from "~/hooks/use-auth";
import { getDocsSlugs, getSourceFromSlugArray } from "~/lib/docs-mdx";
import Sidebar from "~/modules/docs/components/Sidebar";

interface Props {
	code: string;
	metadata: Metadata;
}

interface Metadata {
	seo_title: string;
	title: string;
}

export default function DocsPage({ code, metadata }: Props) {
	const { isAuthenticated, isLoading, user } = useAuth();
	const MDXComponent = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<>
			<NextSeo title={metadata.seo_title} />
			<div className="w-screen min-h-screen overflow-hidden text-black bg-white dark:text-white dark:bg-black">
				<div className="flex flex-col h-full mx-auto max-w-7xl lg:flex-row">
					<div className="top-0 block w-full h-full border-gray-300 lg:sticky lg:min-h-screen lg:w-72 lg:border-r dark:border-gray-600">
						<Sidebar />
					</div>
					<div className="box-border flex flex-col flex-auto h-full px-4 pt-4 pb-8 lg:h-auto lg:py-8 lg:px-8">
						<Link href={isAuthenticated ? "/dashboard" : "/login"}>
							<a className="flex items-center gap-2 px-2 py-2 ml-auto font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 ring-offset-2 ring-offset-current">
								{isAuthenticated ? "Dashboard" : "Login"} <HiArrowRight />
							</a>
						</Link>
						<article className="mt-8 prose dark:prose-dark flex-grow-1">
							<h1 className="mb-8">{metadata.title}</h1>
							<MDXComponent />
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
			options.remarkPlugins = [
				...(options.remarkPlugins ?? []),
				require("remark-code-titles"),
				require("remark-slug"),
				[
					require("remark-autolink-headings"),
					{
						linkProperties: {
							className: ["anchor"],
						},
					},
				],
			];

			options.rehypePlugins = [
				...(options.rehypePlugins ?? []),
				require("mdx-prism"),
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
				params: { slug: item.replace(/\.mdx?/, "").split("/") },
			};
		}),
		fallback: false,
	};
};
