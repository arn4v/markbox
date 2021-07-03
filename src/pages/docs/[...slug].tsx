import clsx from "clsx";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { HiArrowRight } from "react-icons/hi";
import { Logo } from "~/components/Logo";
import { useAuth } from "~/hooks/use-auth";
import { getDocsSlugs, getSourceFromSlugArray } from "~/lib/docs-mdx";
import { Awaited } from "~/types";

interface Props {
	code: Awaited<ReturnType<typeof serialize>>;
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
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();
	const slug = "/docs/" + (router.query.slug as string[]).join("/");

	return (
		<>
			<NextSeo title={metadata.seo_title} />
			<div className="w-screen h-screen text-black bg-white dark:text-white dark:bg-black">
				<div className="flex flex-col w-full h-full mx-auto lg:w-3/5 lg:flex-row">
					<div className="sticky flex flex-col items-start justify-start w-full h-full gap-8 pt-8 border-gray-300 lg:border-r lg:w-1/5 dark:border-gray-600">
						<Logo className="text-black dark:text-white" />
						<div className="flex flex-col w-full gap-8">
							{sidebarData.map((item) => {
								return (
									<div
										key={item.title}
										className="flex flex-col items-start justify-start gap-2"
									>
										<h2 className="block font-semibold">{item.title}</h2>
										<div className="flex flex-col w-full gap-2 lg:pl-4">
											{item.children.map((child) => {
												return (
													<Link
														key={`${item.title}-${child.title}`}
														href={child.href}
													>
														<a
															className={clsx([
																"block py-1 px-2 rounded-l-md transition",
																slug === child.href
																	? "bg-cyan-100 dark:bg-cyan-200 dark:mix-blend-multiply border-r-4 border-cyan-600 dark:border-cyan-700 font-medium text-black"
																	: "hover:bg-cyan-100 dark:hover:bg-cyan-200 dark:hover:text-black dark:text-white",
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
					<div className="flex flex-col flex-grow px-4 py-8 lg:px-8">
						<Link href={isAuthenticated ? "/dashboard" : "/login"}>
							<a className="flex items-center gap-2 pb-px ml-auto transition border-gray-400 hover:border-b">
								{isAuthenticated ? "Dashboard" : "Login"} <HiArrowRight />
							</a>
						</Link>
						<article className="pt-8 prose dark:prose-dark flex-grow-1">
							<h1 className="mb-8">{metadata.title}</h1>
							<MDXRemote {...code} />
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
	const { content, data } = matter(source);
	const code = await serialize(content, {
		mdxOptions: {
			remarkPlugins: [
				require("remark-code-titles"),
				[
					require("remark-autolink-headings"),
					{
						linkProperties: {
							className: ["anchor"],
						},
					},
				],
				require("remark-slug"),
			],
			rehypePlugins: [require("mdx-prism")],
		},
	});

	return {
		props: {
			code,
			metadata: data as Metadata,
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
