import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Logo } from "~/components/Logo";

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
		title: "API",
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

const Sidebar = () => {
	const router = useRouter();
	const slug = "/docs/" + (router.query.slug as string[]).join("/");

	return (
		<div className="top-0 flex flex-col items-start justify-start w-full h-full gap-8 px-4 pt-8 lg:min-h-screen lg:px-0">
			<Logo className="text-black dark:text-white" />
			<div className="flex flex-col w-full gap-8">
				{sidebarData.map((item) => {
					return (
						<nav
							key={item.title}
							className="flex flex-col items-start justify-start gap-2"
						>
							<h2 className="block font-semibold">{item.title}</h2>
							<ul className="flex flex-col w-full gap-2 lg:pl-4">
								{item.children.map((child) => {
									return (
										<li key={`${item.title}-${child.title}`}>
											<Link href={child.href}>
												<a
													className={clsx([
														"block py-1 px-2 rounded-l-md",
														slug === child.href
															? "bg-blue-100 dark:bg-blue-200 dark:mix-blend-multiply border-r-4 border-blue-600 dark:border-blue-700 font-medium text-black"
															: "hover:bg-blue-100 dark:hover:bg-blue-200 dark:hover:text-black dark:text-white",
													])}
												>
													{child.title}
												</a>
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>
					);
				})}
			</div>
		</div>
	);
};

export default Sidebar;
