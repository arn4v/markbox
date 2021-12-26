import { MDXProvider } from "@mdx-js/react";
import { NextSeo } from "next-seo";
import React from "react";
import MDXComponents from "~/components/MDXComponents";
import AuthButton from "~/modules/docs/components/AuthButton";
import Sidebar from "~/modules/docs/components/Sidebar";

export default function DocsPage({
	children,
	frontMatter: metadata,
}: {
	children: React.ReactNode;
	frontMatter: {
		title: string;
		seo_title: string;
		layout: string;
	};
}) {
	return (
		<>
			<style jsx scoped>
				{`
					h1.heading {
						margin-bottom: 0;
					}
				`}
			</style>
			<NextSeo title={`${metadata.seo_title} | Docs`} />
			<div className="w-screen min-h-screen text-black bg-white dark:text-white dark:bg-black">
				<div className="flex flex-col h-auto mx-auto max-w-7xl lg:flex-row">
					<div className="sticky top-0 block w-full h-auto bg-white border-gray-300 shadow-lg lg:px-4 dark:bg-black lg:shadow-none lg:h-screen lg:min-h-screen lg:w-72 lg:border-r dark:border-gray-600">
						<Sidebar />
					</div>
					<div className="box-border flex flex-col flex-auto h-full px-4 pt-4 pb-8 lg:h-auto lg:py-8 lg:px-8">
						<AuthButton className="hidden lg:flex lg:ml-auto" />
						<article className="mt-8 prose dark:prose-dark flex-grow-1">
							<h1 className="lg:mb-8 heading">{metadata.title}</h1>
							<div className="overflow-x-hidden">
								<MDXProvider components={MDXComponents}>{children}</MDXProvider>
							</div>
						</article>
					</div>
				</div>
			</div>
		</>
	);
}
