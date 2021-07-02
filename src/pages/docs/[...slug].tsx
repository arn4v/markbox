import clsx from "clsx";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
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

type Category = {
	title: string;
	children: { title: string; href: string }[];
};

const sidebarData: Category[] = [
	{
		title: "General",
		children: [
			{
				title: "Introduction",
				href: "/docs/introduction",
			},
			{
				title: "Contributing",
				href: "/docs/contributing",
			},
			{
				title: "Data Models",
				href: "/docs/models",
			},
		],
	},
	{
		title: "API v1 Endpoints",
		children: [
			{
				title: "bookmarks",
				href: "/docs/endpoints/v1/bookmarks",
			},
			{
				title: "tags",
				href: "/docs/endpoints/v1/tags",
			},
		],
	},
];

export default function DocsPage({ code, metadata }: Props) {
	const Component = React.useMemo(() => getMDXComponent(code), [code]);
	const router = useRouter();
	const slug = "/docs/" + (router.query.slug as string[]).join("/");

	return (
		<>
			<NextSeo title={metadata.seo_title} />
			<div className="w-screen h-screen bg-white">
				<div className="flex w-3/5 h-full mx-auto">
					<div className="sticky flex flex-col items-start justify-start w-1/5 h-full gap-8 pt-8 border-r border-gray-300">
						<Logo className="text-black" />
						<div className="flex flex-col w-full gap-8">
							{sidebarData.map((item) => {
								return (
									<div
										key={item.title}
										className="flex flex-col items-start justify-start gap-2"
									>
										<h2 className="block font-semibold">{item.title}</h2>
										<div className="flex flex-col w-full gap-2 pl-4">
											{item.children.map((child) => {
												return (
													<Link
														key={`${item.title}-${child.title}`}
														href={child.href}
													>
														<a
															className={clsx([
																"block py-1 px-2 rounded-l-md",
																slug === child.href
																	? "bg-cyan-100 text-black border-r-2 border-cyan-600 font-medium"
																	: "hover:bg-cyan-100",
															])}
														>
															{child.title}
														</a>
													</Link>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div className="flex flex-col flex-grow pt-8">
						<Link href="/login">
							<a className="flex items-center gap-2 ml-auto">
								Login <HiArrowRight />
							</a>
						</Link>
						<article className="px-8 pt-8 flex-grow-1">
							<h1 className="mb-8 text-2xl font-bold">{metadata.title}</h1>
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
